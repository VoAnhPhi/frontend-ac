# ACW3 Week 3 UI

React, TypeScript, and Tailwind implementation of the ACW3 Profile design. The Week 3 flow is `master` → `develop` → feature branches. `develop` starts from clean `origin/master`; the older local `master`, `week-01`, and `week-02` branches are unchanged.

```sh
npm install
npm run dev
npm run build
```

## API

The app reads [DummyJSON](https://dummyjson.com/docs) from `VITE_API_BASE_URL` in `.env`. Sign in with a DummyJSON user, for example `emilys` / `emilyspass`. Every page except the landing page and `/leaderboard` requires sign-in.

| Screen                      | Endpoint                                                                  |
| --------------------------- | ------------------------------------------------------------------------- |
| Sign in                     | `POST /auth/login`                                                        |
| Register                    | `POST /users/add`                                                         |
| Header, Profile             | `GET /auth/me`, retried after `POST /auth/refresh` on 401                 |
| Profile → Tokens, NFTs      | `GET /carts/user/{id}` with `GET /products?limit=0&select=stock,category` |
| Token List                  | `GET /products?limit=10&skip=…`                                           |
| Token List → Edit           | `GET /products/{id}`, then `PUT /products/{id}`                           |
| Token List → Delete         | `DELETE /products/{id}`                                                   |
| Token Creator               | `POST /products/add`                                                      |
| NFT List                    | `GET /products/category/mens-watches?limit=10&skip=…`                     |
| NFT Creator                 | `POST /products/add` with `category: mens-watches`                        |
| Token List, NFT List → Mint | `POST /carts/add`                                                         |
| Leaderboard                 | `GET /products?sortBy=rating&order=desc&limit=50`                         |

Tokens and NFTs are products: name ↔ `title`, supply and balance ↔ `stock`, image ↔ `thumbnail`, and the price is shown under the name. NFTs are the products in the `mens-watches` category, so they also appear in the Token List. Fields a product does not have keep the values from the design (100% of supply, 0% minted, 200 ZKN wallet balance), and a creator form's other fields (symbol, decimals, image, links) are validated but not sent.

The profile's assets are the products in the user's carts: a cart line's quantity is the balance, and the share of the product's `stock` is the % of supply. Minting adds the amount to those holdings. The leaderboard ranks products by `rating`: the creator is the `brand`, the market cap is `price × stock`, and 24h change and volume show `-` because DummyJSON has no data for them. Edit Profile is saved per user in localStorage.

DummyJSON simulates writes without storing them. The app applies each create, update, delete, and mint response to its cache, and keeps that cache until you reload the page or sign out. An account created with Register cannot sign in, and a token or NFT created in the app does not exist on the server, so editing or deleting it returns `Product with id '195' not found` and minting it is refused. Requests time out after 15 seconds.

See [the source review](docs/week-03-review.md) for the baseline assessment and branch order.
