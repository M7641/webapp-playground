## Some steps I had to take to resolve python issues

What ever happens the most important things are to:
1. Ensure that a good version of python is installed.
2. Ensure that in the home directory "~/" there is a .bashrc file
3. Then add

``` bash
alias python=/usr/bin/python3.12
alias python3=/usr/bin/python3.12
```

4. if the error `ModuleNotFoundError: No module named 'distutils'` is happening then `sudo apt install python3.12-distutils`
5. Next being `apt-get update --fix-missing` and then `sudo apt-get install python3.12-venv`
6. This at least allowed me to use a virtual environment which is something.

From there, the version being used will be the right one.
I have not worked out how this will work with virtual environments.

This did work, yay.

Take 2 with the fast api one:

1. Ensure node is up to date
2. npm install -g npm@latest

Even with the cmd it is still not able to find python. But it can update pip so something really odd is going on there.
So appears as though the issue is that it's running it through windows rather than the WSL and for windows it is not working.
I installed Python for all users which meants it was not in the AppData which is where windows was looking for it.

3. next issue wwas concurrency. The Next side was looking for the python side too soon. Thus Run the python side first before trying to run the app. 
 

4. python rather than python3 as I did not have that alias set up, nor would I know where to do that.

That is now working!