"""Build-time centerline interpolation shared by the geographic importers."""
import math,bisect
def xy(p,ori=None):
 ori=ori or p[0];return [((x-ori[0])*111320*math.cos(math.radians(ori[1])),(y-ori[1])*111320) for x,y in p]
def length(p,closed=True):return sum(math.dist(a,b) for a,b in zip(p,p[1:]+(p[:1] if closed else [])))
def rotate_nearest(p,pt):
 i=min(range(len(p)),key=lambda i:math.dist(p[i],pt));return p[i:]+p[:i]
def spline(p,closed=True):
 if math.dist(p[0],p[-1])<.01:p=p[:-1]
 out=[];n=len(p)
 for i in range(n if closed else n-1):
  q1=p[i];q2=p[(i+1)%n];q0=p[(i-1)%n] if closed or i else (2*q1[0]-q2[0],2*q1[1]-q2[1]);q3=p[(i+2)%n] if closed or i<n-2 else (2*q2[0]-q1[0],2*q2[1]-q1[1])
  # Centripetal Catmull-Rom: no loops/overshoot at tight road nodes.
  ts=[0]
  for a,b in zip([q0,q1,q2],[q1,q2,q3]):ts.append(ts[-1]+max(.001,math.dist(a,b)**.5))
  def mix(a,b,t,ta,tb):return tuple((a[k]*(tb-t)+b[k]*(t-ta))/(tb-ta) for k in (0,1))
  steps=max(2,math.ceil(math.dist(q1,q2)/2))
  for j in range(steps):
   t=ts[1]+(ts[2]-ts[1])*j/steps
   a=mix(q0,q1,t,ts[0],ts[1]);b=mix(q1,q2,t,ts[1],ts[2]);c=mix(q2,q3,t,ts[2],ts[3])
   out.append(mix(mix(a,b,t,ts[0],ts[2]),mix(b,c,t,ts[1],ts[3]),t,ts[1],ts[2]))
 if not closed:out.append(p[-1])
 return out

def uniform(p,L,closed=True,spacing=3):
 p=spline(p,closed); raw=length(p,closed);scale=L/raw;p=[(x*scale,y*scale) for x,y in p]
 if closed:p.append(p[0])
 s=[0]
 for a,b in zip(p,p[1:]):s.append(s[-1]+math.dist(a,b))
 N=math.ceil(L/spacing);out=[]
 for i in range(N if closed else N+1):
  d=L*i/N;j=min(len(p)-2,bisect.bisect_right(s,d)-1);f=(d-s[j])/(s[j+1]-s[j]);out.append([p[j][k]*(1-f)+p[j+1][k]*f for k in (0,1)])
 # Compensate final polygon chord/rounding error without distorting the shape.
 correction=L/length(out,closed)
 out=[[round(x*correction,6),round(y*correction,6)] for x,y in out]
 return out,raw,scale
