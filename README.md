# BeesKnees Backend

## Date: 12/7/2022

### By: Kalen Luciano: [GitHub](https://github.com/kalenluciano) | [LinkedIn](https://www.linkedin.com/in/kalenluciano/)

#### [BeeKnees Frontend](https://github.com/kalenluciano/bees-knees-frontend)

#### [Deployed Site](http://bees-knees-frontend.herokuapp.com)

---

### **_Description_**

This app allows users to post content, follow other users, and interact with other users' posts through likes, dislikes, comments, and reposts.

The news feed, called The Buzz, displays the most recent posts from a user's followers. The explore page, called Pollination Station, renders the most recent posts from all users. A user can click on a profile and follow other users.

When a user clicks on a post, the page recursively renders all of the post's comments and their related comment threads. The counts for followers, following, reactions, comments, and reposts all update based on a user's interaction with portfolios and posts.

Join the hive!

---

### **_Getting Started_**

-   `Fork` and `clone`
-   `cd` into the directory
-   Run `sequelize db:create`
-   Run `sequelize db:migrate`
-   Run `sequelize db:seed:all`
-   Run `npm run dev`

A Trello board was used to keep track of development progress and can be viewed [here](https://trello.com/b/2omo5oFi/beesknees).

---

### **_Technologies_**

-   PostgreSQL
-   Sequelize
-   Express.js
-   Node.js
-   JavaScript

**_Entity Relationship Diagram:_**

## ![Entity Relationship Diagram](./assets/bees-knees-ERD.drawio.png)

---

### **_Future Updates_**

-   [ ] Add a relation to track posts viewed by user and filter/sort posts to send to a user based on viewed content
-   [ ] Add in verified users and give more weight to reactions by verified users on posts about a specific topic
