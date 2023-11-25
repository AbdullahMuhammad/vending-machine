A simple application simulating Vending machine.
Nothing fancy, just wanted to showcase my style of engineering/development.
Some of the tasks covered are as follows. 
**Tasks**
- REST API is implemented consuming and producing “application/json”
- Product model is implemented with amountAvailable, cost (should be in multiples of 5), productName and sellerId fields
- User model is implemented with username, password, deposit and role fields
- Authentication with JWT and passport 
- CRUD for users (POST /user should not require authentication to allow new user registration)
- CRUD for a product model (GET can be called by anyone, while POST, PUT and DELETE can be called only by the seller user who created the product)
- /deposit endpoint so users with a “buyer” role can deposit only 5, 10, 20, 50 and 100 cent coins into their vending machine account (one coin at the time)
- /buy endpoint (accepts productId, amount of products) so users with a “buyer” role can buy a product (shouldn't be able to buy multiple different products at the same time) with the money they’ve deposited. API should return total they’ve spent, the product they’ve purchased and their change if there’s any (in an array of 5, 10, 20, 50 and 100 cent coins)
- /reset endpoint so users with a “buyer” role can reset their deposit back to 0

TDD was used to implement the above features.
Big fan of TDD.
A boilerplate was used for node, express and mysql.
App can be improved in 100 ways but a balance has to be maintained between beautiful code and time to market.
I think I did a good job here to maintain that balance.
I spent 2-3 days to implement above. You can see the repo.