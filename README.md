# Part 1

## How to run

1. Clone the repository
2. Run the following command in the terminal
```bash
docker compose up
```

It will create a container with the client application running on port 3000 and server on 3001.

Also, it will create 3 posts and 5 users in the database.

### User 1: Robert
```
email: robert@hotmail.com
password: Robert
```
### User 2: Emely
```
email: emely@hotmail.com
password: Emely
```
### User 3: Martin
```
email: martin@hotmail.com
password: Martin
```

## Tests

Run unit tests
```bash
npm run test
npm run test:cov
```

Run e2e tests
```bash
npm run test:e2e
```

# Part 2

SQL function placed in the sql/calculate_amortization_schedule.sql file.
