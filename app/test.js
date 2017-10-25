
// AdEsFRgthZ
writeline(readline().match(/../g).map(i=>i.replace(/(.)(.)/,"$2$1")).join(''))

// 8
// OR
// -8
N=+readline()
s=[]
p=N<0?-1:1
for(i=1;i<=p*N;i++)s[i-1]=i*p
writeline(s.join())


