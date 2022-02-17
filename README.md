![screenshot](https://raw.githubusercontent.com/DNI9/your-secrets-re/main/public/your-secrets-banner.jpg)

<h2 align="center">
    An web application made with remix, to share secret messages with friends
</h2>
<h3 align='center'>Other Tools</h3>
<p align="center">
<a href="https://supabase.io/" target="_blank" rel="noreferrer">
	<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
</a>
<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
	<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwindcss" />
</a>
<a href="https://vercel.com/" target="_blank" rel="noreferrer">
	<img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="vercel" />
</a>
</p>

## Screenshots

|                        |                       |                             |
| :--------------------: | :-------------------: | :-------------------------: |
| ![](.assets/login.png) | ![](.assets/home.png) | ![](.assets/new_secret.png) |

|                              |                                |                               |
| :--------------------------: | :----------------------------: | :---------------------------: |
| ![](.assets/new_message.png) | ![](.assets/messages_page.png) | ![](.assets/profile_page.png) |

## Development

```sh
cp .env.example .env
```

Remember to set env vars to vercel as well

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
yarn install
```

Afterwards, start the Remix development server like so:

```sh
yarn dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.

## Deployment

[Import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).
