# SkyCrop Frontend

## Development

Install dependencies with `npm install` and start the frontend with `npm run dev`.

The frontend uses the rebuilt [SkyCrop mock API](https://github.com/upc-GreenTech/skycrop-mock-api) deployed on Azure. Its base URL is configured in `.env` for development and production builds. A local API process is not required.

```text
https://skycrop-fake-api-fre4gthff0hudyew.chilecentral-01.azurewebsites.net/api/v1
```

The existing API clients use `/plots` and `/crops`. The mock exposes 29 collections for future views; their presence does not mean those views or business operations are implemented. Verify availability with `GET /api/v1/health` and inspect the resources with `GET /` at the Azure domain.

## Languages

English is the default language. Use the EN/ES selector in the header to switch languages. The selection is saved in the browser.

## Plots

- `/plots`: registered plots and search by name or location.
- `/plots/new`: registration with name, area in hectares, and location.
- `/plots/:id`: persisted plot details.

## Crops

- `/plots/:id/crops`: crops associated with a plot.
- `/plots/:id/crops/new`: crop registration.

The API is a mock service hosted on Azure. Maps and telemetry remain separate features. Collections may be empty after rebuilding the mock. Authentication, payment processing and image analysis are not provided by generic CRUD.

Run `npm run build` to compile the application. Configure `VITE_SKYCROP_API_URL` for the target API when building for another environment.
