-- Demo content for a fresh clone. Safe to re-run (upsert on primary key).
-- Applied by `pnpm db:setup`, or automatically on `supabase start` / `db reset`.
insert into public.infographics (id, content, updated_at)
values (
  'default',
  '{
    "title": "Community Efforts",
    "subtitle": "A summary of activities and initiatives in our area",
    "neighborhood": "Our Neighborhood",
    "year": "2026",
    "categories": [
      {
        "id": "cat-social",
        "title": "Social Action",
        "tabLabel": "Neighborhood",
        "description": "Building capacity for service and fellowship",
        "color": "emerald",
        "subcategories": [
          {
            "id": "sub-youth",
            "name": "Youth",
            "bullets": [
              { "id": "b1", "text": "Junior Youth Spiritual Empowerment Program" },
              { "id": "b2", "text": "Tutoring and homework support" },
              { "id": "b3", "text": "Service projects in the neighborhood" }
            ]
          },
          {
            "id": "sub-wellbeing",
            "name": "Community Wellbeing",
            "bullets": [
              { "id": "b4", "text": "Food assistance initiatives" },
              { "id": "b5", "text": "Visiting the elderly" }
            ]
          }
        ]
      },
      {
        "id": "cat-discourses",
        "title": "Public Discourses",
        "tabLabel": "Outreach",
        "description": "Conversations that enrich community life",
        "color": "violet",
        "subcategories": [
          {
            "id": "sub-conversations",
            "name": "Conversations",
            "bullets": [
              { "id": "b6", "text": "Participation in local forums" },
              { "id": "b7", "text": "Discussions on justice and unity" },
              { "id": "b8", "text": "Interfaith gatherings" }
            ]
          },
          {
            "id": "sub-media",
            "name": "Media & Outreach",
            "bullets": [
              { "id": "b9", "text": "Social media presence" },
              { "id": "b10", "text": "Newsletter contributions" }
            ]
          }
        ]
      },
      {
        "id": "cat-teaching",
        "title": "Teaching",
        "tabLabel": "Invitation",
        "description": "Sharing the message through personal relationships",
        "color": "amber",
        "subcategories": [
          {
            "id": "sub-firesides",
            "name": "Firesides",
            "bullets": [
              { "id": "b11", "text": "Regular home gatherings" },
              { "id": "b12", "text": "Introductory talks on the Faith" },
              { "id": "b13", "text": "Online firesides for seekers" }
            ]
          },
          {
            "id": "sub-individual",
            "name": "Individual Conversations",
            "bullets": [
              { "id": "b14", "text": "Sharing the writings" },
              { "id": "b15", "text": "Inviting friends to core activities" }
            ]
          }
        ]
      },
      {
        "id": "cat-core",
        "title": "Core Activities",
        "tabLabel": "Gatherings",
        "description": "Study, worship, and classes for all ages",
        "color": "rose",
        "subcategories": [
          {
            "id": "sub-study",
            "name": "Study Circles",
            "bullets": [
              { "id": "b16", "text": "Ruhi Books 1–7" },
              { "id": "b17", "text": "Book 1 in progress" }
            ]
          },
          {
            "id": "sub-devotional",
            "name": "Devotional Gatherings",
            "bullets": [
              { "id": "b18", "text": "Weekly devotional meetings" },
              { "id": "b19", "text": "Special holy day observances" }
            ]
          },
          {
            "id": "sub-children",
            "name": "Children''s Classes",
            "bullets": [
              { "id": "b20", "text": "Weekly classes (ages 5–11)" },
              { "id": "b21", "text": "Arts, virtues, and prayers" }
            ]
          }
        ]
      }
    ]
  }'::jsonb,
  now()
)
on conflict (id) do update
set
  content = excluded.content,
  updated_at = excluded.updated_at;
