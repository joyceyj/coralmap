// https://gist.github.com/tansangxtt/d0c319ba1d5751f0518a3d878e93a79f
import { reshape } from 'mathjs'
// function encode(binMask, h, w) {
//     var cnts:number[] = [];
//     var a = h*w;
//     var k=0, p=0, c=0;
//     for(var j = 0; j<a; j++) { 
//         if(binMask[j] != p) { 
//             cnts[k++] = c; 
//             c = 0; 
//             p = binMask[j]; 
//         } 
//         c++; 
//     }
//     cnts[k++]=c; 
//     return cnts;
// }      

// function decode(rleArr) {
//     var decodedBinMask:number[] = [];
//     var v = 0; 
//     var idx = 0;
//     for(var j=0; j < rleArr.length; j++ ) {
//         for(var k=0; k < rleArr[j]; k++ ) {
//             decodedBinMask[idx++] = v;         
//         }   
//         v = 1 - v;   
//     }  
//     return decodedBinMask;
// }
function decode([rows, cols], counts, flat=true) {
    let pixelPosition = 0,
      binaryMask
  
    if (flat) {
        binaryMask = Array(rows * cols).fill(0)
    } else {
        binaryMask = Array.from({length: rows}, (_) => Array(cols).fill(0))
    }

    for (let i = 0, rleLength = counts.length; i < rleLength; i += 2) {
        let zeros = counts[i],
            ones = counts[i + 1] ?? 0

        pixelPosition += zeros 

        while (ones > 0) {
        const rowIndex = pixelPosition % rows,
                colIndex = (pixelPosition - rowIndex) / rows

        if (flat) {
            const arrayIndex = rowIndex * cols + colIndex
            binaryMask[arrayIndex] = 1
        } else {
            binaryMask[rowIndex][colIndex] = 1
        }

            pixelPosition++
            ones--
        }
    }
    if (!flat) {
        console.log("Result matrix:")
        binaryMask.forEach((row, i) => console.log(row.join(" "), `- row ${i}`))
    }
    
    return binaryMask
}
// function rleToString(rleArr) {
//     var s:number[] = [];
//     var p = 0;
//     for(var i=0; i<rleArr.length; i++ ) {
//         var x=rleArr[i]; 
//         if(i > 2) {
//             x -= cnts[i-2]; 
//         }         
//         var more = true;
//         while( more ) {
//             var c = x & 0x1f; 
//             x >>= 5; 
//             more = (c & 0x10) ? x!=-1 : x!=0;
//             if(more) { 
//                 c |= 0x20;
//             } 
//             c += 48; 
//             s[p++] = c;
//         }
//     }    
//     return s;
// }

// function rleFromString(encodedRLEStr) {
//     var m=0, p=0;
//     var s = encodedRLEStr;    
//     var cnts:number[] =[]; 
//     while( s[p] ) {
//         var x=0, k=0, more=1;
//         while( more ) {
//             var c= s[p].charCodeAt(0) - 48;
//             x |= ((c & 0x1f) << 5*k);
//             more = (c & 0x20); 
//             p++; 
//             k++;
//             if( (!more) && (c & 0x10)) 
//                 x |= (-1 << 5*k);
//         }
//         if(m>2) {
//             x+=cnts[m-2];
//         }
//         cnts[m++]=x ;
//     }        
//     return cnts;
// }

export function rleArrToBinaryMask(input: any, size: number[]) {
    return reshape(decode([size[0], size[1]], input), size);
}