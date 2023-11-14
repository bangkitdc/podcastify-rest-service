# Podcastify REST Service

Podcastify REST Service is an end-to-end service for Podcastify Premium App (SPA) and Podcastify App (Monolith). This service maintains Podcastify's creators and premium podcast. Furthermore, subscription status modification is also processed here with the help of Podcastify Subscription Service (Podcastify SOAP Service).

## Functionality
1. <b>Premium Episode</b> </br> Creators have the ability to create, update, or delete their own premium episodes. These premium episodes are accessible to users of the Podcastify App who subscribed to the creator.
2. <b>Subscription</b> </br> The admin maintains a list of users on the Podcastify App who subscribe to specific creators. The admin has the authority to approve or reject subscription requests from users. Once approved, subscribers gain access to all premium episodes produced by the subscribed creator.
3. <b>Likes</b> </br> In addition to listening to premium episodes, users of the Podcastify App can express their appreciation for episodes by 'liking' them. On Podcastify Premium App, creators have visibility into the number of likes received for each premium podcast episode.
4. <b>Comments</b> </br> Alongside the 'likes' feature, users can also leave comments on premium episodes. Creators can view these comments within the Podcastify Premium App.
5. <b>Subscriber Visibility</b> </br> Creators have the ability to view the list of users who are subscribed to them on the Podcastify Premium App.

## DB Schema
[Belom]

## API Endpoint
Please refer here [link postman] to get the full versions of the endpoints.

### Auth
|Method| URL | Explanation | Consumer |
|:--:|:--|:--|:--:|
| POST | /login | Login & Get Access Token | SPA |
| POST | /register | Register | SPA |
| POST | /refresh_token | Request for New Access Token | SPA |
| POST | /logout | Logout & Empty Cookies | SPA |

### User
|Method| URL | Explanation | Consumer |
|:--:|:--|:--|:--:|
| GET | /self | Get Logged In User | SPA |
| GET | /creator | Get All Creators | Monolith |
| GET | /creator/:creator_id | Get Specific Creator | Monolith |

### Episode
|Method| URL | Explanation | Consumer |
|:--:|:--|:--|:--:|
| GET | /episode | Get All Episodes |  |
| POST | /episode | Create Episode | SPA |
| GET | /episode/:episode_id | Get Specific Episode | SPA & Monolith |
| POST | /episode/:episode_id | Update Episode | SPA |
| DELETE | /episode/:episode_id | Delete Episode | SPA |
| GET | /episode/creator/:creator_id | Get All Episodes by Creator ID | SPA & Monolith |
| POST | /episode/like | Like and Unlike Episode | Monolith |
| POST | /episode/comment | Comment Episode | Monolith |
| GET | /episode/downloadImage/:episode_id | Get Static Image Files | SPA & Monolith |
| GET | /episode/downloadAudio/:episode_id | Get Static Audio Files | SPA & Monolith |

### Subscription
|Method| URL | Explanation | Consumer |
|:--:|:--|:--|:--:|
| GET | /subscription | Get All Subscriptions | SPA |
| GET | /subscription?creator_id= | Get All Subscriptions by Creator ID | SPA |
| PATCH | /subscription | Approve Subscription | SPA | 

## Tech Stacks  
1. Docker
2. Node (Express with TS)
3. Prisma
4. Redis

## How to Get Started
1. Clone this repository
2. Copy the `.env.example` file and rename it to `.env`:
```bash
    cp .env.example .env
```
3. Open the `.env` file and replace the placeholder values with your actual data.
4. On the root of this project, run the following commands:
```bash
    docker-compose up -d --build
```
5. Migrate and seed the DB, run
```bash
    npx prisma db push
    npx prisma db seed
```
6. To shut down the app, run
```bash
    docker-compose down
```
7. Ensure that the Docker Daemon is running

## Tasking
| 13521055                            | 13521072               | 13521102                   |
| :---------------------------------- | :--------------------- | :------------------------- |
| Setup Docker, DB, and Structure     | CRUD Premium Episode   | Subscription               |
| Authentication & Authorization      | Static Files           | Soap Client Handler        |
| Likes & Comments                    |                        |                            |
| Error Handling and Data Validation  |                        |                            |
| Cache                               |                        |                            |

## Copyright
2023 © Podcastify. All Rights Reserved.
