# signup
TOK=$(curl -sS -X POST http://localhost:4000/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"pass123","tenantName":"TestTenant"}' | jq -r '.token')

# create workflow
WF=$(jq -n --arg name "sandbox" --arg slug "sandbox-flow" --argjson json "$(cat ./tests/sandbox-workflow.json)" \
  '{name: $name, slug: $slug, json: $json}' | \
  curl -sS -X POST http://localhost:4000/workflows \
    -H "Authorization: Bearer $TOK" \
    -H "Content-Type: application/json" \
    -d @- | jq -r '.id')

# execute
curl -sS -X POST http://localhost:4000/workflows/$WF/execute -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" -d '{"hello":"world"}' | jq
