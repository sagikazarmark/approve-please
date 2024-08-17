# approve-please

> A GitHub App built with [Probot](https://github.com/probot/probot) that Get your own pull request pre-approved (Jorji Costava style)

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t approve-please .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> approve-please
```

## Contributing

If you have suggestions for how approve-please could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2024 Mark Sagi-Kazar
