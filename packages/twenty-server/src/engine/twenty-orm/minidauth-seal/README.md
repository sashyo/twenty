# Twenty + minidauth — a CRM whose contacts your own server can't read

A proof of concept that seals a contact's personal fields with [minidauth](https://github.com/sashyo/minidauth)
inside Twenty's ORM, so **Postgres holds only ciphertext**, the key that decrypts it is **never on the
Twenty server**, and a **quorum — not the app — decides whether contact data can be read at all**.

A CRM is the crown-jewel PII store: every customer's name, email, phone, and notes in one database. Self-
hosting keeps that data on your own box, but it still sits there in plaintext, so one stolen dump, leaked
backup, or compromised admin session hands over the entire contact list. This changes that: each personal
field is sealed by the Tide ORK cohort before it reaches the database, and no single machine — including
this one — ever holds a key that can read it back.

## What changed

One small util, plus a few one-line hooks at the ORM's shared read/write choke points. That's the whole
footprint.

| | |
|---|---|
| `minidauth-seal.util.ts` | Seals the configured personal fields of the configured objects on write, opens them on read. Talks only to the **minidauth-seal sidecar**; holds no key and no Tide credential. |
| `repository/workspace-repository.ts` | **Seal** on write in the three low-level executors — `runInsert`, `runMutation`, `runBatchUpdate` — which both the GraphQL/REST API (via the common query runners) and internal `save`/`insert`/`update` funnel through. |
| `api/common/common-result-getters/common-result-getters.service.ts` | **Open** on read in `processRecord`, the one place the API shapes every record before returning it. |

The API and internal services take different paths at the top but converge on these executors and this
result-getter, so hooking them covers the GraphQL API, the REST API, and the record table in the UI at once,
with no change to the object model, resolvers, or front end.

Off by default: with `MINIDAUTH_SEAL_URL` unset, every path is a no-op and Twenty behaves exactly like
upstream. Set it to the sidecar URL to turn it on.

## What is sealed, and what is not

Configured in `SEALED_FIELDS` in the util. For the standard **Person** object:

- `name.firstName`, `name.lastName`
- `emails.primaryEmail`, `emails.additionalEmails[]`
- `phones.primaryPhoneNumber`
- `jobTitle`, `city`

Each of these is stored as `ms1:<ciphertext>` in its column. Everything else — object metadata, relations,
timestamps, and every other object — stays plaintext and fully queryable. Add an object or field by editing
one map; the seal follows automatically because it runs at the repository. Composite fields (`emails`,
`phones`, `name`) are nested objects at this layer, so subfields are addressed by dotted path and sealed leaf
by leaf.

What a `pg_dump` of the contact then holds:

```json
{
  "nameFirstName": "ms1:AQAAAAEAAAAC…",
  "emailsPrimaryEmail": "ms1:AQAAAAEAAAAC…",
  "phonesPrimaryPhoneNumber": "ms1:AQAAAAEAAAAC…",
  "jobTitle": "ms1:AQAAAAEAAAAC…", "city": "ms1:AQAAAAEAAAAC…"
}
```

## Why a CRM benefits from Tide

Normal field encryption keeps a key next to the data — in an env var, or a KMS the same service can call — so
whatever can read the CRM database can read the key too. minidauth removes that, which matters more for a CRM
than almost anywhere:

- **A stolen CRM database or backup reads nothing.** There is no key in Postgres, in the Twenty server's env,
  or in the sidecar. The single most valuable table in the company is ciphertext at rest.
- **The key is never assembled.** It lives as threshold shares across ~20 independent Tide ORK nodes; a reveal
  is a **14-of-20** cohort operation, so there is no one machine where the key can be copied.
- **A quorum controls who can read contacts, not the app.** Reads are gated on a `crm-reader` role a quorum
  granted through minidauth. Revoke it and every contact goes unreadable across the whole CRM instantly, with
  no deploy and no change to Twenty — exactly what you want for offboarding or incident response. Access is
  *governed*, not asserted by whoever holds the server.
- **Transparent and reversible.** One util, a handful of hooks, off by default. Sales reps and the UI see normal
  contacts; the database and a stolen backup see ciphertext.

The trust that used to sit in "whoever holds the CRM database and its key" is split across an independent
cohort and a governance quorum. Breaching the app is no longer enough to walk away with the customer list.

## Proof

[`prove-seal.ts`](prove-seal.ts) runs the real integration end to end against a live minidauth key and the
ORK cohort — no Twenty runtime required. It builds a Person exactly as Twenty hands it to the repository,
calls the same `sealWorkspaceRecords` the write path calls, stores it in a Postgres table shaped like the
person columns, dumps the row (all ciphertext), then calls the same `openWorkspaceRecords` the read path
calls and prints the contact back. Revoke `crm-reader` in minidauth and the decrypt is refused with a 403 —
the contact stays sealed.

```sh
MINIDAUTH_SEAL_URL=http://localhost:3021 \
DEMO_PG=postgres://postgres:postgres@localhost:5433/yourdb \
npx tsx prove-seal.ts
```

## Running it inside Twenty

Point the ORM at the sidecar and start Twenty as usual:

```sh
export MINIDAUTH_SEAL_URL=http://localhost:3021   # the minidauth-seal sidecar
```

The sidecar needs a minidauth with a vendor key, an encrypt policy, a **PUBLIC** (voucher-gated) decrypt
policy, and a `crm-reader` role granted through the quorum to the sidecar's reader id. See the
[minidauth operator guide](https://github.com/sashyo/minidauth/blob/main/docs/running.md).

## Honest status

- **It is a proof of concept.** Each sealed field is one round trip to the cohort, so it fits a demo, not a
  large production instance. A real integration would protect one per-record data key with the cohort and AES
  the payload under it locally (envelope encryption): one cohort op per record instead of per field. The
  sidecar is the right place to add that.
- **Sorting and filtering on a sealed column stop working at the database** (it is ciphertext), so the objects
  and fields you seal should be ones you don't need to query on server-side. Names, emails and phones are
  usually fine; sealing a field you sort a big list by is not.
- The decrypt policy must be **PUBLIC** (voucher-gated) for the sidecar's account-less reads.
