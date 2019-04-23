use sakila;
# 1a. Display the first and last names of all actors from the table actor.
select first_name, last_name
from actor;
# 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
select upper(concat(first_name," ", last_name)) as 'Actor name'
from actor;
# 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." 
# What is one query would you use to obtain this information?

select first_name, last_name
from actor
where first_name like "joe%";

# 2b. Find all actors whose last name contain the letters GEN:
select first_name, last_name
from actor
where last_name like "%gen%";

#2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
select first_name, last_name
from actor
where last_name like "%Li%"
order by last_name, first_name;

# 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
select country_id, country
from country
where country in ('Afghanistan', 'Bangladesh', 'China');

#3a. You want to keep a description of each actor. 
# You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB 
# (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).
ALTER TABLE actor
ADD COLUMN description BLOB;

# 3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.
ALTER TABLE actor DROP COLUMN description;

# 4a. List the last names of actors, as well as how many actors have that last name.
select last_name, count(*) as "Number of people with same last name"
from actor
group by last_name;

# 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
drop view if exists number_of_actor;
create view number_of_actor as
select last_name, count(*) as "Number"
from actor
group by last_name;

select * 
from number_of_actor
where number > 1;

# 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.
UPDATE actor
SET first_name = "HARPO"
WHERE first_name = "GROUCHO" and last_name = "WILLIAMS";
select *
from actor
WHERE first_name = "HARPO" and last_name = "WILLIAMS";

# 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. 
# It turns out that GROUCHO was the correct name after all! 
# In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.
UPDATE actor
SET first_name = "GROUCHO"
WHERE first_name = "HARPO";

# 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
SHOW CREATE TABLE address;

# 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
select first_name, last_name, address.address
from staff
left join address
on staff.address_id = address.address_id;

# 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment
select * from staff;
select * from payment where payment_date like "2005-08%" ;

select s.staff_id, s.first_name, s.last_name, sum(p.amount) as 'total amount'
from staff as s
left join (
			select * from payment where payment_date like "2005-08%"
            ) as p
on s.staff_id = p.staff_id
group by p.staff_id;

# 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
select * from film_actor;
select * from film;

select f.film_id,f.title, count(a.actor_id) as 'number of actor'
from film as f
inner join film_actor as a
on f.film_id = a.film_id
group by f.film_id;

# 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
select count(*) 
from inventory 
where film_id in (
				  select film_id from film 
                  where title = "Hunchback Impossible") ;
# 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
select * from customer;
select * from payment;

select c.first_name, c.last_name,sum(p.amount) as 'Total Amount Paid'
from customer as c
left join payment as p
on c.customer_id = p.customer_id
group by c.customer_id
order by c.last_name,c.first_name;

# 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. 
# As an unintended consequence, films starting with the letters K and Q have also soared in popularity. 
# Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
select title from film
where language_id in (
					select language_id from language
					where name = "English")
and title like "k%" or title like "q%";

# 7b. Use subqueries to display all actors who appear in the film Alone Trip
select first_name, last_name from actor
where actor_id in (
			select actor_id from film_actor
			where film_id in (
							select film_id from film
							where title = "Alone Trip"));

# 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. 
# Use joins to retrieve this information.
select first_name, last_name, email from customer
where address_id in (
					select address_id from address
					where city_id in (
										select city_id from city 
										where country_id in(
														select country_id from country
														where country = "Canada")));
 
 # 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
 select title from film
 where film_id in (
				 select film_id from film_category
				 where category_id in (
									 select category_id from category
									 where name = "Family"));

# 7e. Display the most frequently rented movies in descending order.
select count(r.rental_id) as 'Rental Frequency', film.title from (
				select rental.rental_id, i.film_id
				from rental
				left join inventory as i
				on rental.inventory_id = i.inventory_id) as r
left join film
on film.film_id = r.film_id
group by film.title
order by count(r.rental_id) desc;

# 7f. Write a query to display how much business, in dollars, each store brought in.
select ss.store_id, sum(amount) as 'Total Business' from (
				select store.store_id, staff.staff_id from store
				left join staff
				on staff.store_id = store.store_id) as ss
left join payment
on payment.staff_id = ss.staff_id
group by ss.store_id;

# 7g. Write a query to display for each store its store ID, city, and country.
select * from store; #address_id
select * from address; #city Id address id
select * from city; # city name city id
select * from country; #country id country name

select saci.store_id, saci.city, country.country from (
				select city.country_id, city.city, sa.store_id from (
								select store.store_id, address.city_id from store
								left join address
								on store.address_id = address.address_id) as sa
				left join city
				on city.city_id = sa.city_id) as saci
left join country
on country.country_id = saci.country_id;

# 7h. List the top five genres in gross revenue in descending order. 
# (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
select rental_id, inventory_id from rental;
select rental_id, amount from payment;
select inventory_id, film_id from inventory;
select film_id, category_id from film_category;

drop view if exists main;
create view main as
select r.name, sum(payment.amount) as 'Gross Revenue'  from payment
left join (
			select rental.rental_id, i.name from rental
			left join (
						select inventory.inventory_id, inventory.film_id, c.name
						from inventory
						left join (
									select film_category.film_id, film_category.category_id, category.name from film_category
									left join category
									on film_category.category_id=category.category_id) as c
						on c.film_id = inventory.film_id) as i
			on rental.inventory_id = i.inventory_id) as r
on r.rental_id = payment.rental_id
group by r.name
order by sum(payment.amount) desc;

select * from main limit 5;

# 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. 
# Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
# same as 7h

# 8b. How would you display the view that you created in 8a?
select * from main;

#8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
drop view if exists main;

