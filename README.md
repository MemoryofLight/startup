# startup
This file has been modified.
I was forced to modify it in Github :(
Oh to be a college student who practices redundancy.

I learned how to merge files and resolve the conflicts between them. I got familiar with the push and pull commands and some of the syntax of markdown. I learned how to use the functionality in VScode for committing - which I did not know before. I know how to push and pull from the terminal and from the IDE now and I also know how to commit from terminal, IDE and Github which is good because I was confused before. And now this is all on line 6 so we will see how that goes. I also learned how to save all using CTRL K and then S. I learned how to identify myself and set my identity for git too. I forked someone's code and, Finally, I was able to clone a repository that I made so that was pretty cool.
Always Add, Commit, Push until your fingers fall off.

# Development and Production environments
-my development environment is my computer and my production environment is AWS
-Never develop in the production environment
-Deployment of app should be done via a CI (continuous integration) process- this checkouts the application code, links it, builds it, tests it, stages it, tests it more, and finally pushes the application to the production environment and notifies.
-we are gonna use a simple console shell script for our CI process.
-to deploy run `./deployService.sh -k ~/prod.pem -h yourdomain.click -s simon` or something akin to that.
k provides the credential file to access production environment, h is domain name of prod environment, s is the name of the app you are deploying (simon or startup).
