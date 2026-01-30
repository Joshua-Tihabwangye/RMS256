# Template → React mapping (USER/templates → frontend)

All Django templates under `USER/templates` are represented in the React + TypeScript frontend as follows.

**Page structure:** Each page lives in its own folder under `src/pages/` with its component and CSS, e.g. `Dashboard/Dashboard.tsx` and `Dashboard/Dashboard.css`. Shared auth form styles are in `pages/shared/auth.css` and imported by SignIn, SignUp, ForgotPassword, and ResetPassword.

## USER (public)

| Template | React page | Route |
|----------|------------|--------|
| USER/index.html | Home.tsx | `/` |
| USER/food.html | OrderMenu.tsx | `/food` |
| USER/softdrinks.html | OrderMenu.tsx | `/softdrinks` |
| USER/alcohol.html | OrderMenu.tsx | `/alcohol` |
| USER/fast_foods.html | OrderMenu.tsx | `/fast-foods` |

## Authentication

| Template | React page | Route |
|----------|------------|--------|
| Authentication/signin.html | SignIn.tsx | `/signin` |
| Authentication/signup.html | SignUp.tsx | `/signup` |

## Registration (password reset)

| Template | React page | Route |
|----------|------------|--------|
| Registration/forgot_password.html | ForgotPassword.tsx | `/forgot-password` |
| Registration/reset_password.html | ResetPassword.tsx | `/reset-password/:uidb64/:token` |

## Admin

| Template | React page | Route |
|----------|------------|--------|
| Admin/dashboard.html | Dashboard.tsx | `/dashboard` |
| Admin/edit_foods.html | EditMenu.tsx | `/admin/edit-foods` |
| Admin/edit_drinks.html | EditMenu.tsx | `/admin/edit-drinks` |
| Admin/edit_alcohol.html | EditMenu.tsx | `/admin/edit-alcohol` |
| Admin/edit_fast_foods.html | EditMenu.tsx | `/admin/edit-fast-foods` |
| Admin/breakfast.html, lunch.html, supper.html, … | OrdersList.tsx | `/admin/orders/:category` |
| Admin/logout.html | AdminLayout (Sign Out button) | — |

All frontend logic is in TypeScript; data is loaded and submitted via the Django REST API under `/api/`.
