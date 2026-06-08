// Solve the affine map overlay-userspace -> galaxy-userspace from measured
// region centers, then compose it with the overlay arms-image matrix so the
// image lands in galaxy.svg's coordinate system.
const GX = {"Acrux":[5126.56,4372.89],"Brice-Corporation":[2415.02,953.85],"Camros":[2014.66,3547.06],"Cappella":[3401.14,629.8],"Forseti":[3460.53,4860.47],"Janus":[2364.14,3858.01],"Kiran-Republic":[3202.37,4141.73],"Lesna":[1136.7,3624.43],"Luxor":[4256.47,2443.39],"Magna-Mater":[2812.17,2949.85],"Magnus-Arma":[2914.47,2425.9],"Nimes":[2056.04,4342.93],"Phanes":[4822.27,2078.83],"Serephim":[5663.83,1859.4],"Tarf":[4155.12,846.25],"The-Chosen":[3292.17,3388.58],"The-League":[3614.83,4497.25],"The-New-Kingdome":[3776.86,3288.35],"The-Old-Kingdome":[3120.55,3338.16],"Tyre":[3718.53,1821.26]};
const OV = {"Acrux":[20239.52,16790.7],"Brice-Corporation":[9948.91,5608.29],"Camros":[9151.61,14669.6],"Cappella":[13268.9,4124.51],"Forseti":[14568.77,18907.04],"Janus":[10467.09,15689.11],"Kiran-Republic":[13477.49,16430.71],"Lesna":[6118.96,15169.22],"Luxor":[17189.73,10720.27],"Magna-Mater":[13360.19,11226.92],"Magnus-Arma":[13029.47,6341.84],"Nimes":[9488.38,17454.05],"Phanes":[17966.65,6855.04],"Serephim":[21754.45,9691.84],"Tarf":[15975.76,4665.28],"The-Chosen":[13570.34,13813.18],"The-League":[14983.53,17476.98],"The-New-Kingdome":[15268.04,13301.91],"The-Old-Kingdome":[12953.32,13749.78],"Tyre":[14687.72,8209.54]};

const ids = Object.keys(GX);
// Design: for target t in {x,y}: t = p*ovx + q*ovy + r. Normal equations 3x3.
function solve(targetIdx) {
  let Sxx=0,Sxy=0,Sx=0,Syy=0,Sy=0,N=0,Stx=0,Sty=0,St=0;
  for (const id of ids) {
    const [ox,oy]=OV[id]; const t=GX[id][targetIdx];
    Sxx+=ox*ox; Sxy+=ox*oy; Sx+=ox; Syy+=oy*oy; Sy+=oy; N++;
    Stx+=t*ox; Sty+=t*oy; St+=t;
  }
  // Matrix [[Sxx,Sxy,Sx],[Sxy,Syy,Sy],[Sx,Sy,N]] * [p,q,r] = [Stx,Sty,St]
  const A=[[Sxx,Sxy,Sx],[Sxy,Syy,Sy],[Sx,Sy,N]];
  const b=[Stx,Sty,St];
  // Gaussian elimination
  for(let i=0;i<3;i++){
    let piv=A[i][i], pr=i;
    for(let k=i+1;k<3;k++) if(Math.abs(A[k][i])>Math.abs(piv)){piv=A[k][i];pr=k;}
    [A[i],A[pr]]=[A[pr],A[i]]; [b[i],b[pr]]=[b[pr],b[i]];
    for(let k=0;k<3;k++){ if(k===i)continue; const f=A[k][i]/A[i][i];
      for(let j=0;j<3;j++)A[k][j]-=f*A[i][j]; b[k]-=f*b[i]; }
  }
  return [b[0]/A[0][0], b[1]/A[1][1], b[2]/A[2][2]];
}
const [Aa,Ab,Ac]=solve(0); // gx_x = Aa*ovx+Ab*ovy+Ac
const [Ad,Ae,Af]=solve(1); // gx_y = Ad*ovx+Ae*ovy+Af

// Residuals
let maxr=0, sumr=0;
for(const id of ids){
  const [ox,oy]=OV[id];
  const px=Aa*ox+Ab*oy+Ac, py=Ad*ox+Ae*oy+Af;
  const d=Math.hypot(px-GX[id][0],py-GX[id][1]);
  maxr=Math.max(maxr,d); sumr+=d;
}
console.log("affine A (overlay->galaxy):");
console.log("  x = ",Aa.toFixed(6),"*ox +",Ab.toFixed(6),"*oy +",Ac.toFixed(3));
console.log("  y = ",Ad.toFixed(6),"*ox +",Ae.toFixed(6),"*oy +",Af.toFixed(3));
console.log("residual (galaxy units, viewBox 6692x5438): max",maxr.toFixed(1),"mean",(sumr/ids.length).toFixed(1));

// Compose A ∘ M_use. M_use (image-local -> overlay): a1,b1,c1,d1,e1,f1
const a1=4.81401,b1=0.124514,c1=-0.109609,d1=4.23775,e1=2904.08,f1=1577.2;
const a=Aa*a1+Ab*b1;
const b=Ad*a1+Ae*b1;
const c=Aa*c1+Ab*d1;
const d=Ad*c1+Ae*d1;
const e=Aa*e1+Ab*f1+Ac;
const f=Ad*e1+Ae*f1+Af;
const fmt=(n)=>Number(n.toFixed(5));
console.log("\ngalaxy-space image matrix (for <image width=4608 height=4608>):");
console.log(`matrix(${fmt(a)},${fmt(b)},${fmt(c)},${fmt(d)},${fmt(e)},${fmt(f)})`);
