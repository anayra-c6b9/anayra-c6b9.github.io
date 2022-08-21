let cMatrix;
let BMatrix;
let bMatrix;
let zMatrix;
let minimumRatio;

async function updateMatrix(outgoing, incoming, keyElement){
    

    //updating BMatrix
    for(var index=0; index<BMatrix[0].length; index++)
    {
        if(index===0)
        {
            BMatrix[outgoing][index]=cMatrix[incoming-1];
        }else
            BMatrix[outgoing][index]=incoming;
    }
    //updated

    //updating bMatrix
    var antiKeyValue=keyElement;
    //----converting keyElement to 1 and transforming that row
    for(var index=0; index<bMatrix[0].length; index++)
    {
        bMatrix[outgoing][index]=bMatrix[outgoing][index]/antiKeyValue;
    }
    //----converting keyElements column elements to 0 and transforming their row
    var solutionElement;
    for(var index=0; index<bMatrix.length; index++)
    {
        if(index!=outgoing)
        {
            solutionElement=bMatrix[index][incoming];
            for(var j=0; j<bMatrix[index].length; j++)
            {
                bMatrix[index][j]-=bMatrix[outgoing][j]*solutionElement;
            }
        }
    }
    //updated bMatrix

    //updating zMatrix
    for(var i=0; i<zMatrix.length; i++)
    {   
        var z_j=0;
        for(var j=0; j<bMatrix.length; j++)
        {
            z_j+=bMatrix[j][i+1]*BMatrix[j][0];
        }
        zMatrix[i]=z_j-cMatrix[i];
    }
    //updated zMatrix

    var col=Number(document.getElementById('col').value);
    var row=Number(document.getElementById('row').value);

    displayMatrix();
    checkCompletion(row, col);

}

async function computeVariable(row, col){
    var operationType=document.getElementById('operationType').value;
    var tableDiv=document.getElementById('tableDiv');

    //finding incoming variable of zMatrix
    var lowestz=0;
    for (let index = 1; index < zMatrix.length; index++) {
        if(operationType==='max')
            {
                if(zMatrix[index] < zMatrix[lowestz])
                    lowestz=index;
            }
        else if(operationType==='min')
            {
                if(zMatrix[index] > zMatrix[lowestz])
                    lowestz=index;
            }
    }

    //incoming variable
    var incomingVariable=lowestz+1;

    //assigning minimumRatio matrix
    for(var index=0; index<minimumRatio.length; index++)
    {
        var ratio=bMatrix[index][0]/bMatrix[index][lowestz+1];
        if(ratio>0 && ratio!=Infinity)
        {
            minimumRatio[index]=ratio;
        } else
            minimumRatio[index]=null;
    }

    //checking the minimum ratio
    var ratioFlag=0;
    for(var i=0; i<minimumRatio.length; i++)
    {
        if(minimumRatio[i]!=null)
            ratioFlag=1;
    }
    if(ratioFlag===0)
        terminateSys();

    //outgoing variable
    var min=null;
    for(var index=0; index<minimumRatio.length; index++)
    {
        if(min===null && minimumRatio[index]!=null)
        {
            min=index;
        }else if(minimumRatio[index]!=null && minimumRatio[index]<minimumRatio[min])
        {
            min=index;
        }
    }
    var outgoingVariable=BMatrix[min][2];

    var keyElement=bMatrix[min][incomingVariable];

    //printing incoming, outgoing variables and key elements, printing the minimumRatio Matrix
    tableDiv.innerHTML+=`<br><span>Incoming variable: x<sub>${incomingVariable}</sub></span><br>
    <table style="border: 1px solid black"><tr style="border: 1px solid black">
    <td style='font-weight: bold; border: 1px solid black;'>Ratio</td></tr></table>`;
    for(var i=0; i<minimumRatio.length; i++)
        if(minimumRatio[i]!=null)
            tableDiv.innerHTML+=`<table><tr><td>${minimumRatio[i].toFixed(2)}</td></tr></table>`;
    tableDiv.innerHTML+=`<span>Outgoing Variable: x<sub>${BMatrix[min][2]}</sub></span><br>
    <span>Key element: ${keyElement}<span><br><br>`; 

    updateMatrix(min, incomingVariable, keyElement);

}

async function terminateSys(){
    col=Number(document.getElementById('col').value);
    var resultDiv=document.getElementById('resultDiv');
    resultDiv.innerHTML+=`<br>The solution for the given Maximization problem is :<br>`;

    for(var i=1; i<=col; i++)
    {
        var flag=0;
        for(var j=0; j<BMatrix.length; j++)
        {
            if(i===BMatrix[j][2])
            {
                resultDiv.innerHTML+=`<span>x<sub>${BMatrix[j][2]}</sub> : ${bMatrix[j][0]}</span><br>`;
                flag=1;
            }
        }
        if(flag===0)
            resultDiv.innerHTML+=`<span>x<sub>${i}</sub> : 0</span><br>`; 
        
    }
}

function displayMatrix(){
    var tableDiv=document.getElementById('tableDiv');

    //cmatrix table
    cMatrixHtml='<table style="border: 1px solid black; display: inline-block; margin: 0px 0px 0px 140px;"><tr  style="border: 1px solid black;">';
    for(var i=0; i<=cMatrix.length; i++)
    {
        if(i===0)
            {
                cMatrixHtml+='<td style="font-weight: bold; border: 1px solid black;">C<sub>j</sub></td>';
            }
        else
            cMatrixHtml+=`<td  style="border: 1px solid black;">${cMatrix[i-1]}</td>`;
    }
    cMatrixHtml+=`</tr></table><br>`;
    tableDiv.innerHTML+=cMatrixHtml;

    //BMatrix table
    BMatrixHtml='<table style="border: 1px solid black; display: inline-block; margin: 0px;"><tr  style="font-weight:bold; border: 1px solid black;"><td>c<sub>B</sub></td><td>B</td><td>x<sub>B</sub></td>';
    for(var i=0; i<BMatrix.length; i++)
    {
        BMatrixHtml+='<tr style="border: 1px solid black;">';
        for(var j=0; j<3; j++)
        {
            if(j===1)
            {
                BMatrixHtml+=`<td style="border: 1px solid black;">a<sub>${BMatrix[i][j]}</sub></td>`;
            }
            else if(j==2)
            {
                BMatrixHtml+=`<td style="border: 1px solid black;">x<sub>${BMatrix[i][j]}</sub></td>`;
            }
            else
            {
                BMatrixHtml+=`<td style="border: 1px solid black;">${BMatrix[i][j]}</td>`;
            }
        }
        BMatrixHtml+='</tr>';
    }
    BMatrixHtml+='</table>';
    tableDiv.innerHTML+=BMatrixHtml;

    //bmatrix table
    bMatrixHtml='<table style="border: 1px solid black; display: inline-block; margin: 0px;"><tr  style="font-weight:bold; border: 1px solid black;"><td>b</td>';
    for(var i=0; i<bMatrix[0].length-1; i++)
    {
        bMatrixHtml+=`<td>a<sub>${i+1}</sub></td>`;
    }
    bMatrixHtml+=`</tr>`;
    for(var i=0; i<bMatrix.length; i++)
    {
        bMatrixHtml+=`<tr>`;
        for(var j=0; j<bMatrix[i].length; j++)
        {
            bMatrixHtml+=`<td>${bMatrix[i][j].toFixed(2)}</td>`;
        }
        bMatrixHtml+=`</tr>`;
    }
    bMatrixHtml+=`</table>`;
    tableDiv.innerHTML+=bMatrixHtml;

    //zMatrix Table
    zMatrixHtml='<br><table style="border: 1px solid black; display: inline-block; margin: 0px 0px 0px 140px;"><tr  style="border: 1px solid black;"><td style="border: 1px solid black; font-weight: bold; width:40px">z<sub>j</sub>-c<sub>j</sub></td>';
    for(var i=0; i<zMatrix.length; i++)
    {
        zMatrixHtml+=`<td  style="border: 1px solid black;">${zMatrix[i].toFixed(2)}</td>`;
    }
    zMatrixHtml+=`</tr></table>`;
    tableDiv.innerHTML+=zMatrixHtml;
}

function checkCompletion(row, col){
    var operationType=document.getElementById('operationType').value;

    //checking values in zMatrix
    for(var i=0; i<zMatrix.length; i++)
    {
        zMatrix[i]=Number(zMatrix[i]);
    }
    flag=0;
    for(var i=0; i<zMatrix.length; i++)
    {
        if(operationType==='max')
        {
            if(zMatrix[i]<0)
                flag=1;
        }
        else if(operationType==='min')
        {
            if(zMatrix[i]>0)
                flag=1;
        }
    }
    if(flag===0)
    {
        console.log('thank god this is not the problem');
        terminateSys();
    } else
        computeVariable(row, col);
}

async function createMatrix(row, col){
    //cMatrix
    for(var i=0; i<cMatrix.length; i++)
    {
        cMatrix[i]=Number(document.getElementById(`c${i}`).value);
    }

    //bMatrix
    for(var i=0; i<row; i++)
    for(var j=0; j<row+col+1; j++)
    {
        if(j==0)
        {
            bMatrix[i][j]=Number(document.getElementById(`b${i}`).value);
        }
        else
        {
            bMatrix[i][j]=Number(document.getElementById(`val${i}${j}`).value);
        }
    }

    //identityMatrix
    var idMatrix=Array(bMatrix.length).fill().map(()=>Array(bMatrix.length));
    for(var i=0; i<idMatrix.length; i++)
    {
        for(var j=0; j<idMatrix[i].length; j++)
        {
            if(i===j)
                idMatrix[i][j]=1;
            else
                idMatrix[i][j]=0;
        }
    }

    //BMatrix
    var count=0;
    var check=0;
    var flag=-1;
    var store=[];

    for(var j=1; j<bMatrix[0].length; j++)
    {
        check=0;
        for(var i=0; i<bMatrix.length; i++)
        {
            if(bMatrix[i][j]===idMatrix[i][count])
                check++;
        }
        if(check===bMatrix.length)
        {
            store.push(j);
            count++;
        }    
        if(count===idMatrix.length)
        {
            flag=0;
            break;
        }
    }

    if(flag===-1)
    {
        alert(`Hey! it looks like we can't make an identity matrix out of the table`);
        window.location.reload();
    }

    //assigning BMatrix
    for(var i=0; i<BMatrix.length; i++)
    {
        for(var j=0; j<3; j++)
        {
            if(j===0)
            {
                BMatrix[i][j]=cMatrix[store[i]-1];
            }
            else
                BMatrix[i][j]=store[i];
        }
    }

    //zMatrix
    for(var i=0; i<zMatrix.length; i++)
    {   
        var z_j=0;
        for(var j=0; j<bMatrix.length; j++)
        {
            z_j+=bMatrix[j][i+1]*BMatrix[j][0];
        }
        zMatrix[i]=z_j-cMatrix[i];
    }

    displayMatrix();
    checkCompletion(row, col);
}

async function declareMatrix(){
    var col=Number(document.getElementById('col').value);
    var row=Number(document.getElementById('row').value);

    cMatrix=new Array(row+col);
    BMatrix=Array(row).fill().map(()=>Array(3));
    bMatrix=Array(row).fill().map(()=>Array(row+col+1));
    zMatrix=new Array(col+row);
    minimumRatio=new Array(row);

    createMatrix(row, col);
}

async function createTable(){
    var equationType=document.getElementById('equationType').value;
    console.log(equationType);
    if(equationType==='lesser')
    {
        var insertValuesDiv=document.getElementById('readerDiv');
        var col=Number(document.getElementById('col').value);
        var row=Number(document.getElementById('row').value);
        insertValuesDiv.innerHTML='';
        insertValuesDiv.innerHTML+=`<br>Surplus Variables : `;
        for(var i=col+1;i<=col+row; i++)
            insertValuesDiv.innerHTML+=`x<sub>${i}</sub> `;
        insertValuesDiv.innerHTML+=`<br>`;

        for(var rowindex=0; rowindex<row; rowindex++)
        {
            var equationRow=`<div style="text-align: center;">`;
            var equationCol=``;
            for(var colindex=0; colindex<row+col+1; colindex++)
            {
                if(colindex==(row+col))
                    {equationCol+=`<span>b<sub>${rowindex+1} : </sub></span><input type='text' id='b${rowindex}' style="width: 40px; margin-right: 10px">`;}
                else
                    equationCol+=`<span>a<sub>${rowindex+1}${colindex+1} : </sub></span><input type='text' id='val${rowindex}${colindex+1}' style="width: 40px; margin-right: 10px">`;
            }
            equationRow+=equationCol+`</div>`;
            insertValuesDiv.innerHTML+=equationRow;
        }

        var zvalRow=`<div style="text-align: center; padding-top: 10px;"><span>z = </span>`;
        for(var colindex=0; colindex<row+col; colindex++)
        {
            zvalRow+=`<span>c<sub>${colindex+1}</sub> : </span><input type='text' id='c${colindex}' style="width: 40px; margin-right: 10px">`;
        }
        zvalRow+=`</div>`;
        insertValuesDiv.innerHTML+=zvalRow;

        startButton=document.getElementById('startButton');
        startButton.style["visibility"]="visible";
    }
}

document.getElementById('createButton').addEventListener('click', createTable);
document.getElementById('startButton').addEventListener('click', declareMatrix);
