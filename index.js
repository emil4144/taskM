window.onload=function(){
    document.getElementById("date").innerText=new Date("01/13/2020").toDateString();
    let tax=7;
    let roundingRule=95;
    let PricingMode=0
    let cost=0;
    let defaultMarkup=52
    let defaultMarkupInput=document.getElementById("defaultMarkup");
    let defaultMarkupLog=document.getElementById("defaultMarkupLog");
    let costInput=document.getElementById("cost");    
    let costLog=document.getElementById("costLog");
    let taxInput=document.getElementById("tax");
    let roundingRuleInput=document.getElementById("rounding");
    let PricingModeInput=document.getElementById("pricing");
    let calculationBtn=document.getElementById("calculationButton");
    defaultMarkupInput.value=defaultMarkup;
    defaultMarkupInput.oninput=function(e){
        if(Number(e.target.value)<10||Number(e.target.value)>=100||Number.isNaN(e.target.value)){
            defaultMarkupLog.innerText='Default markup range limit is "10-200"';
        }
        else{
            defaultMarkupLog.innerText='' ;
        }
        defaultMarkup=Number(e.target.value)
    }
    costInput.oninput=function(e){
        if(Number(e.target.value)<0||Number.isNaN(e.target.value)){
            costLog.innerText='cost range must be greater than "0"';
        }
        else{
            costLog.innerText='' ;
        }
        cost=Number(e.target.value)
    }
    taxInput.onchange=function(e){
        tax=Number(e.target.value);
    }
    roundingRuleInput.onchange=function(e){
        roundingRule=Number(e.target.value);
    }
    PricingModeInput.onchange=function(e){
        PricingMode=Number(e.target.value);
    }
    costInput.onkeypress= defaultMarkupInput.onkeypress = function(e) {      
        let charStr = String.fromCharCode(e.which||e.keyCode);
        if (!/^\d*\.?\d*$/.test(charStr)) {
            return false;
        }
    };

    calculationBtn.onclick=function(){
        if(defaultMarkupLog.innerText||costLog.innerText){
            return
        }        
        let rawPrice=Math.round(cost/(1-defaultMarkup/100)*10000)/10000;       
        let grossProfit;
        let grossProfitP;
        let taxExPrice;
        let taxInclusiveprice;
        let roundedPrice;
        
        if(PricingMode==0){  
            roundedPrice=round(roundingRule,rawPrice);
            taxExPrice=roundedPrice;
            taxInclusiveprice=Math.round((taxExPrice+((taxExPrice*tax)/100))*100)/100;
            grossProfit=getGrossProfit(taxExPrice,cost);
            grossProfitP=getGrossProfitP(grossProfit,taxExPrice);
        }
        else if(PricingMode==1){
            rawPrice=rawPrice+Math.round(((rawPrice*tax)/100)*100)/100;
            roundedPrice=round(roundingRule,rawPrice);
            taxInclusiveprice=roundedPrice;
            taxExPrice=Math.round((taxInclusiveprice/(1+(tax/100)))*100)/100;
            grossProfit=getGrossProfit(taxExPrice,cost);
            grossProfitP=getGrossProfitP(grossProfit,taxExPrice);
    
        }
        document.getElementById("t_i_p").innerText=taxInclusiveprice;
        document.getElementById("t_e_p").innerText=taxExPrice;
        document.getElementById("grossProfitP").innerText=grossProfitP;
        document.getElementById("grossProfit").innerText=grossProfit;
    }   
}
function round(roundingRule,rawPrice){    
        switch(roundingRule){
            case 95:
                return rawPrice-Math.trunc(rawPrice)>0.45?Math.ceil(rawPrice)-0.05:Math.floor(rawPrice)-0.05;
                                   
            case 99:
                return rawPrice-Math.trunc(rawPrice)>0.50?Math.ceil(rawPrice)-0.01:Math.floor(rawPrice)-0.01;
                
            case 00:
                return rawPrice-Math.trunc(rawPrice)>0.40?Math.ceil(rawPrice):Math.floor(rawPrice);
                
            default:
                return rawPrice-Math.trunc(rawPrice)>0.40?Math.ceil(rawPrice):Math.floor(rawPrice);

        }     
}

function getGrossProfit(taxExPrice,cost){
   return Math.round((taxExPrice-cost)*100)/100;  
}
function getGrossProfitP(grossProfit,taxExPrice){
    return Math.round(((grossProfit/taxExPrice)*100)*100)/100;
 }