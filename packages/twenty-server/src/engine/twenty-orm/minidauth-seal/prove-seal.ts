/**
 * Proof that the minidauth-seal integration works on Twenty's real Person shape, end to end,
 * against the live minidauth key and the Tide ORK cohort. No Twenty runtime needed - this exercises
 * the actual util the repository calls (sealWorkspaceRecords / openWorkspaceRecords) and a real
 * Postgres table shaped like the person columns.
 *
 *   MINIDAUTH_SEAL_URL=http://localhost:3021 DEMO_PG=postgres://... npx tsx prove-seal.ts
 */
import { Client } from 'pg';

import {
  openWorkspaceRecords,
  sealWorkspaceRecords,
} from './minidauth-seal.util';

const PG = process.env.DEMO_PG ?? 'postgres://postgres:postgres@localhost:5433/formbricks';

// A Person exactly as Twenty hands it to the workspace repository: composite fields are nested.
const buildPerson = () => ({
  id: '11111111-1111-1111-1111-111111111111',
  name: { firstName: 'Ada', lastName: 'Lovelace' },
  emails: { primaryEmail: 'ada@analyticalengine.io', additionalEmails: ['ada.l@babbage.org'] },
  phones: { primaryPhoneNumber: '5559080', primaryPhoneCountryCode: 'GB', primaryPhoneCallingCode: '+44' },
  jobTitle: 'Chief Algorithm Officer',
  city: 'London',
});

async function main() {
  const pg = new Client({ connectionString: PG });
  await pg.connect();
  await pg.query(`create table if not exists person_demo (
    id uuid primary key,
    "nameFirstName" text, "nameLastName" text,
    "emailsPrimaryEmail" text, "emailsAdditionalEmails" jsonb,
    "phonesPrimaryPhoneNumber" text, "jobTitle" text, city text
  )`);
  await pg.query('delete from person_demo');

  const person = buildPerson();
  console.log('plaintext contact (what Twenty receives):');
  console.log('  ', person.name.firstName, person.name.lastName, '·', person.emails.primaryEmail, '·', person.phones.primaryPhoneNumber, '·', person.jobTitle, person.city, '\n');

  // WRITE PATH — exactly what workspace-repository.insert()/save() now calls.
  await sealWorkspaceRecords('person', [person]);

  await pg.query(
    `insert into person_demo (id,"nameFirstName","nameLastName","emailsPrimaryEmail","emailsAdditionalEmails","phonesPrimaryPhoneNumber","jobTitle",city)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [person.id, person.name.firstName, person.name.lastName, person.emails.primaryEmail,
     JSON.stringify(person.emails.additionalEmails), person.phones.primaryPhoneNumber, person.jobTitle, person.city],
  );

  const dump = (await pg.query('select * from person_demo')).rows[0];
  console.log('=== what Postgres actually stores (a DB dump of the contact row) ===');
  console.log(JSON.stringify(dump, null, 2));
  const raw = JSON.stringify(dump);
  console.log('\nplaintext leaked to disk?',
    /Ada|Lovelace|analyticalengine|5559080|London|Algorithm/.test(raw) ? 'YES — LEAK' : 'no — every personal field is sealed', '\n');

  // READ PATH — exactly what workspace-repository.find()/findOne() now calls.
  const back = {
    id: dump.id,
    name: { firstName: dump.nameFirstName, lastName: dump.nameLastName },
    emails: { primaryEmail: dump.emailsPrimaryEmail, additionalEmails: dump.emailsAdditionalEmails },
    phones: { primaryPhoneNumber: dump.phonesPrimaryPhoneNumber },
    jobTitle: dump.jobTitle,
    city: dump.city,
  };
  await openWorkspaceRecords('person', [back]);
  console.log('=== read back through the app (the quorum-granted reader decrypts it) ===');
  console.log('  ', back.name.firstName, back.name.lastName, '·', back.emails.primaryEmail, '·', back.phones.primaryPhoneNumber, '·', back.jobTitle, back.city);

  await pg.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
