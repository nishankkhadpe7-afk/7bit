# 7bit Media

Premium MERN portfolio site for a video post-production studio.

## Run

1. Copy `.env.example` values into `client/.env` and `server/.env` as appropriate.
2. `npm install`
3. Start MongoDB, then `npm run seed`
4. `npm run dev`

The public frontend has graceful local fallbacks, so it remains presentable while the API is unavailable. Content is managed through REST endpoints under `/api`.
