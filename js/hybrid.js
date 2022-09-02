//declaring all matrices
let cMatrix;
let BMatrix;
let bMatrix;
let zMatrix;
let oMatrix;
let minimumratio;

async function updateMatrix(outgoing, incoming, keyElement){
    
    var col=Number(document.getElementById('col').value);
    var row=Number(document.getElementById('row').value);

    //killing outgoing artificial variable
    var outgoingValue=BMatrix[outgoing][2];
    if(outgoingValue>col+row)
    {
        for(var index=0; index<bMatrix.length; index++)
        {
            bMatrix[index][outgoingValue]=0;
        }
        cMatrix[outgoingValue-1]=0; //static from now
        zMatrix[outgoingValue-1]=0; //static from now
    }
    //done

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
        if(bMatrix[outgoing][index]!=null)
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
                if(bMatrix[index][j]!=null)
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
            if(bMatrix[j][i+1]!=null)
                z_j+=bMatrix[j][i+1]*BMatrix[j][0];
        }
        zMatrix[i]=z_j-cMatrix[i];
    }
    //updated zMatrix

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
        if(ratio>=0 && ratio!=Infinity && bMatrix[index][lowestz+1]>0)
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
    var operationType=document.getElementById('operationType').value;
    col=Number(document.getElementById('col').value);
    var resultDiv=document.getElementById('resultDiv');
    var ANSWER=0;

    resultDiv.innerHTML+=`<br>The solution for the given `
    if(operationType==='max')
        resultDiv.innerHTML+='Maximization';
    else
        resultDiv.innerHTML+='Minimization';
    resultDiv.innerHTML+=` problem is :<br>`;

    for(var i=1; i<=col; i++)
    {
        var flag=0;
        for(var j=0; j<BMatrix.length; j++)
        {
            if(i===BMatrix[j][2])
            {
                resultDiv.innerHTML+=`<span>x<sub>${BMatrix[j][2]}</sub> : ${bMatrix[j][0].toFixed(2)}</span><br>`;
                ANSWER+=Number(document.getElementById(`c${i-1}`).value)*bMatrix[j][0];
                flag=1;
            }
        }
        if(flag===0)
            resultDiv.innerHTML+=`<span>x<sub>${i}</sub> : 0</span><br>`; 
    }
    resultDiv.innerHTML+=`<br>z : ${ANSWER.toFixed(2)}<br>`;
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

async function createMatrix(row, col, geeq){

    //number of ge or eq constraints
    var spConstaints=geeq;
    // initializing values in cMatrix
    var cAdd=row;
    for(var i=0; i<col; i++)
    {
        if(oMatrix[i]===-1)
        {
            cMatrix[i]=Number(document.getElementById(`c${i}`).value);
        }
        else if(oMatrix[i]===1)
        {
            cMatrix[i]=Number(document.getElementById(`c${i}`).value);
            if(document.getElementById('operationType').value==='min')
                cMatrix[cMatrix.length-spConstaints]=Number(document.getElementById(`max_val`).value);
            else if(document.getElementById('operationType').value==='max')
                cMatrix[cMatrix.length-spConstaints]=Number(document.getElementById(`max_val`).value)*(-1);
            spConstaints--;
        }
        else if(oMatrix[i]===0)
        {
            cMatrix[i]=Number(document.getElementById(`c${i}`).value);
            if(document.getElementById('operationType').value==='min')
                cMatrix[cMatrix.length-spConstaints]=Number(document.getElementById(`max_val`).value);
            else if(document.getElementById('operationType').value==='max')
                cMatrix[cMatrix.length-spConstaints]=Number(document.getElementById(`max_val`).value)*(-1);
            spConstaints--
        }
    }
    console.log(cMatrix.length);

    //initializing values in bMatrix
    //flag for additional variable input
    var bFlag=0;
    //number of ge or eq constraints for artificial variables
    spConstaints=geeq;
    for(var i=0; i<row; i++)
    {
        for(var j=0; j<col+1; j++)
        {
            if(j===0)
            {
                bMatrix[i][j]=Number(document.getElementById(`b${i}`).value);
            }
            else
            {
                bMatrix[i][j]=Number(document.getElementById(`val${i}${j}`).value);
            }
        }
        if(oMatrix[i]===-1)
        {
            bMatrix[i][col+i+1]=1;
        }
        else if(oMatrix[i]===0)
        {
            bMatrix[i][bMatrix[i].length-spConstaints]=1;
            spConstaints--;
        }
        else if(oMatrix[i]===1)
        {
            bMatrix[i][col+i+1]=-1;
            bMatrix[i][bMatrix[i].length-spConstaints]=1;
            spConstaints--;
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

    //checking for the presence of identity matrix in the bMatrix
    var icount=0;
    var ocount=0;
    var store=[];

    for(var x=0; x<row; x++)
    {
        for(var j=1; j<bMatrix[0].length; j++)
        {
            icount=0;
            for(var i=0; i<bMatrix.length; i++)
            {
                if(bMatrix[i][j]===idMatrix[i][x])
                    icount++;
            }
            if(icount===row)
            {
                ocount++;
                store.push(j);
            }
        }
    }


    if(ocount!=row)
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

    console.log(bMatrix);
    displayMatrix();
    checkCompletion(row, col);
}

async function declareMatrix(){
    var col=Number(document.getElementById('col').value);
    var row=Number(document.getElementById('row').value);

    //declaring the oMatrix
    oMatrix=new Array(row);
    //calculating ge or eq constrains
    var geeq=0;
    //calculating the additional variables
    additionalVar=0;
    for(var i=0; i<row; i++)
    {
        if(document.getElementById(`operator${i}`).value==='greater')
            {
                additionalVar+=2;
                oMatrix[i]=1;
                geeq++;
            }  
        else if(document.getElementById(`operator${i}`).value==='less')
            {
                additionalVar++;
                oMatrix[i]=-1;
            }
        else
            {
                additionalVar++;
                oMatrix[i]=0;
                geeq++;
            }
    }

    //declaring the cMatrix
    cMatrix=new Array(col+additionalVar).fill(0);
    console.log(cMatrix.length);
    //declaring the BMatrix
    BMatrix=Array(row).fill().map(()=>Array(3));
    //declaring the bMatrix
    bMatrix=Array(row).fill().map(()=>Array(col+additionalVar+1).fill(0));
    //declaring the zMatrix
    zMatrix=new Array(col+additionalVar);
    //declaring the minimumRatio
    minimumRatio=new Array(row);


    createMatrix(row, col, geeq);
}

async function createTable(){
    var equationType=document.getElementById('equationType').value;
    console.log(equationType);
    if(equationType==='hybrid')
    {
        var insertValuesDiv=document.getElementById('readerDiv');
        var col=Number(document.getElementById('col').value);
        var row=Number(document.getElementById('row').value);

        //taking max value from its user
        insertValuesDiv.innerHTML='';
        insertValuesDiv.innerHTML=`<div><span>Enter the max value (M): </span><input type='text' id='max_val' style="width: 40px; margin-right: 10px"></div>`;

        //prototyping the equations
        for(var rowindex=0; rowindex<row; rowindex++)
        {
            var equationRow=`<div style="text-align: center;">`;
            var equationCol=``;
            for(var colindex=0; colindex<col+2; colindex++)
            {
                if(colindex==(col+1))
                    {equationCol+=`<span>b<sub>${rowindex+1} : </sub></span><input type='text' id='b${rowindex}' style="width: 40px; margin-right: 10px">`;}
                else if(colindex==col)
                    equationCol+=`<span><select name="operation" id='operator${rowindex}'>
                    <option value="less">&#8804;</option>
                    <option value="greater">&#8805;</option>
                    <option value="greater">&#61;</option>
                    </select></span>`;
                else
                    equationCol+=`<span>a<sub>${rowindex+1}${colindex+1} : </sub></span><input type='text' id='val${rowindex}${colindex+1}' style="width: 40px; margin-right: 10px">`;
            }
            equationRow+=equationCol+`</div>`;
            insertValuesDiv.innerHTML+=equationRow;
        }

        //prototyping the operation function
        var zvalRow=`<div style="text-align: center; padding-top: 10px;"><span>z = </span>`;
        for(var colindex=0; colindex<col; colindex++)
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
