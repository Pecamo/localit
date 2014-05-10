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
d_max = 50
x = range(d_max*2)
i = 0
y = range(d_max*2)
m = 0.5/d_max
while x[i] < d_max:
    y[i] = 1-m*x[i]
    print(i,y[i])
    i = i+1
while i < len(x):
    y[i] = min(math.cos(((x[i]-50)*math.pi/2)/(d_max/4.0))*0.5, 1-m*x[i])
    print(i,y[i])
    i = i + 1
for i in range(len(y)):
    if y[i] < 0:
        y[i] = 0
plt.plot(x,y)
plt.show()
