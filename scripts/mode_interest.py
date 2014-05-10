from mpl_toolkits.mplot3d import Axes3D
from matplotlib import cm
from matplotlib.ticker import LinearLocator, FormatStrFormatter
import matplotlib.pyplot as plt
import numpy as np
import math

def drange(start, stop, step):
    r = start
    while r < stop:
        yield r
        r += step
moy = 1
up = 42
x = [x for x in drange(0,10,0.1)]
pop_fact = min((up/2.0*moy)*0.5, 0.5)
print(pop_fact)
y = [math.cos(i*math.pi/10)*(1-pop_fact) + pop_fact for i in x]
for i in range(len(y)):
    if y[i] < 0:
        y[i] = 0
plt.plot(x,y)
plt.show()
