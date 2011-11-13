// ==UserScript==
// @name          Todoist additional shortcuts
// @author        Tomas Strachota
// @namespace     http://temporary.com/todoist
// @description   More keyboard shortcuts for Todoist.
// @include       http://todoist.com/*
// @include       http://www.todoist.com/*
// @date          2010-10-22
// @version       0.2
// @GM_version    0.6.6.20060107.0
// ==/UserScript==/

// SHORTCUTS:
//
// right - select next project
// left - select previous project
// home - select filter box
// end - select last project
// f - focus filter box
// esc - remove focus from filter box 

(function () {
    
var START_PAGE="overdue, today, priority 1, all"
    
// Add a key listener
window.addEventListener('keydown', keyDownListner, false);
window.addEventListener('keyup', keyUpListner, false);

// Add hidden link for displaying start page agenda
var hostElement = document.getElementById("top");
hostElement.innerHTML = '<a href="#start" onclick="return Agenda.forceQuery(\''+ START_PAGE +'\')" id="view_start_page"></a>'+hostElement.innerHTML;

// Cosmetic padding change of the agenda input
document.getElementById("agenda").style.padding = "0 3px";



function keyDownListner(event) {

    if (isTargetInput(event)) {
        return false;
    }
  
    if (event.keyCode == 37) {
        //arrow left
        keyPrev();
        return true;
        
    } else if (event.keyCode == 39) {
        //arrow right
        keyNext();
        return true;
        
    } else if (event.keyCode == 36) {
        //home
        keyHome();
        return true;
        
    } else if (event.keyCode == 35) {
        //end
        keyEnd();
        return true;
        
    } else if ((event.keyCode >= 49) && (event.keyCode <= 57)) {
        //numbers
        if (event.ctrlKey) {
            keyNum(event.keyCode-48);
            return false;
        }
    }
    
    return false;
}

function keyUpListner(event) {
  
    if (event.keyCode == 70) {
        if (isTargetInput(event))
            return false;
        
        //f
        keyF();
        return true;
        
    } else if (event.keyCode == 27) {
        //esc
        keyEsc();
        return true;
    }
    
    return false;
}

function isTargetInput(event) {
    
    if (event.target && event.target.nodeName) {
        var targetNodeName = event.target.nodeName.toLowerCase();
        
        if ((targetNodeName == "textarea") || 
            ((targetNodeName == "input") && 
            (event.target.type) &&
            (event.target.type.toLowerCase() == "text"))) {
            return true;
        }
    }
    
    return false;
}

function getProjectListElem() {
    return document.getElementById("project_list");
}

function getPrevProjectElem() {
    projsElem = getProjectListElem();
    projects = projsElem.getElementsByTagName("li");
    
    prevProjElem = null;
    for(i=0; i<projects.length; i++) {
        if (projects[i].className.match('.*current.*')) {
            return prevProjElem;
        }
        prevProjElem = projects[i];
    }
    
    return null;
}

function getNextProjectElem() {
    projsElem = getProjectListElem();
    projects = projsElem.getElementsByTagName("li");
    
    nextProjElem = null;
    i=0;
    while (i<projects.length) {
        if (projects[i].className.match('.*current.*'))
            break;
        i++;
    }
    
    i++;
    if (i<projects.length) {
        return projects[i];
    }
    
    return null;
}

function getNthProjectElem(n) {
    projsElem = getProjectListElem();
    projects = projsElem.getElementsByTagName("li");
    
    if (n<projects.length)
        return projects[n];
    
    return null;
}

function getLastProjectElem() {
    projsElem = getProjectListElem();
    projects = projsElem.getElementsByTagName("li");
    
    if (projects.length == 0)
        return null;
    
    return projects[projects.length-1];
}


function anyProjectActive() {
    return (window.location.hash.lastIndexOf("#project", 0) === 0)
    /*
    var projects = document.getElementById("project_list").getElementsByTagName("li");
    for (i=0; i<projects.length; i++) {
        if (projects[i].className.match('.*current.*'))
            return true;
    }
    return false;
    */
}

function goHome() {
    simulateClick(document.getElementById("view_start_page"),"click");
}

function highlightAgendaBox(on) {
    if (on)
        document.getElementById("agenda").style.backgroundColor = "#F1F1F1";
    else
        document.getElementById("agenda").style.backgroundColor = "#FFFFFF";
}

function keyPrev() {
    
    prevProj = getPrevProjectElem();
    if (prevProj != null) {
        highlightAgendaBox(false);
        simulateClick(prevProj,"click");
    } else if (anyProjectActive()) {
        highlightAgendaBox(true);
        goHome();
    }
    return;
}

function keyNext() {
    
    nextProj = getNextProjectElem();
    if (nextProj != null) {
        highlightAgendaBox(false);
        simulateClick(nextProj,"click");
    } else if (!anyProjectActive()) {
        highlightAgendaBox(false);
        simulateClick(getNthProjectElem(0),"click");
    }
    return;
}

function keyHome() {
    highlightAgendaBox(true);
    goHome();
    return;
}

function keyEnd() {
    highlightAgendaBox(false);
    simulateClick(getLastProjectElem(),"click");
    return;
}

function keyNum(num) {
    var n = num-1;
    
    nthProject = getNthProjectElem(n);
    if (nthProject != null)
        simulateClick(nthProject,"click");
    return;
}

function keyF() {
    document.getElementById('agenda_box').getElementsByTagName('input')[0].focus();
    document.getElementById('agenda_box').getElementsByTagName('input')[0].select();
    return;
}

function keyEsc() {
    document.getElementById('agenda_box').getElementsByTagName('input')[0].blur();
    return;
}

function simulateClick(node, eventType) {
    var event = node.ownerDocument.createEvent("MouseEvents");
    event.initMouseEvent(eventType,
        true, // can bubble
        true, // cancellable
        window,
        1, // clicks
        50, 50, // screen coordinates
        50, 50, // client coordinates
        false, false, false, false, // control/alt/shift/meta
        0, // button,
        node);
    node.dispatchEvent(event);
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

// Set default agenda highlight
highlightAgendaBox(!anyProjectActive());

})();