var calculatorApp = angular.module('calculatorApp', []);

calculatorApp.controller('calculatorController', ['$scope', '$window', function ($scope, $window) {
    if($window.localStorage.getItem('histories')==null) {
        $window.localStorage.setItem('histories', JSON.stringify([]));
    }
    
    //Try to parse
    try {
        $scope.histories = JSON.parse($window.localStorage.getItem('histories'));
    }
    catch(error) {
        console.log(error);
        //Reset the variable
        $window.localStorage.setItem('histories', JSON.stringify({}));
    }

    console.log($scope.histories);
    const errorString = 'Error';
    $scope.items = ['settings', 'home', 'options', 'other'];
    $scope.showType = false;
    $scope.mathString = 0;
    $scope._buttons = [
        {
            value: '/',
            class: 'button--smaller',
        },
        {
            value: '*',
            class: 'button--smaller',
        },
        {
            value: '-',
            class: 'button--smaller',
        },
        {
            value: '+',
            class: 'button--smaller',
        },
        {value: '9',},
        {value: '8',},
        {value: '7',},
        {
            value: 'DEL',
            type: 'operation',
            class: 'button--smaller',
        },
        {value: '6',},
        {value: '5',},
        {value: '4',},
        {
            value: 'CLC',
            type: 'operation',
            class: 'button--smaller',
        },
        {value: '3',},
        {value: '2',},
        {value: '1',},
        {
            value: '=',
            type: 'operation',
            rowSpan: 2,
        },
        {value: '.',},
        {value: '0',},
        {value: '00',},
    ]; 

    let _checkDelay = 0;

    let originalFontSize = -1;
    let lengthOverflow = -1;

    function overflowChecker(reset) {
        $targetElement = document.querySelector('.inputArea__value');
        $parentElement = document.querySelector('.inputArea__valueContainer');
        let curFontSize = parseFloat(getComputedStyle($targetElement)['fontSize'].replace("px",""));

        if(originalFontSize==-1) {
            originalFontSize = parseFloat(getComputedStyle($targetElement)['fontSize'].replace("px",""));
        }
        
        if(_checkDelay) {
            _checkDelay = clearTimeout(_checkDelay);
        }

        _checkDelay = setTimeout(() => {

            if(reset)  {
                $targetElement.style = '';
                return;
            }
        
            if($targetElement.scrollHeight >= $parentElement.offsetHeight && curFontSize > 0) {
                lengthOverflow = $targetElement.textContent.length;
                curFontSize = curFontSize - (6 * Math.floor($targetElement.scrollHeight / $parentElement.offsetHeight));
            }
            else {
                if(curFontSize < originalFontSize) {
                    if($targetElement.textContent.length - lengthOverflow <= -5) {
                        curFontSize = curFontSize + 6;
                    }
                    else {
                        return;
                    }
                }
                else {
                    return;
                }
            }

            $targetElement.style.fontSize = curFontSize + "px";
            $targetElement = document.querySelector('.inputArea__value');

            _checkDelay = setTimeout(() => {
                overflowChecker();
            }, 100);
            
        }, 100);
    }

    $scope.buttonClick = function(obj) {
        let reset = false;
        if($scope.mathString==errorString) $scope.mathString='';
        if(Object.keys(obj).includes('type') && obj.type=="operation") {
            switch (obj.value) {
                case 'DEL':
                    if($scope.mathString!="0" || $scope.mathString!='') {
                        //$scope.mathString = eval($scope.mathString);
                        $scope.mathString = String($scope.mathString).substr(0, String($scope.mathString).length-1)
                    }
                    break;
                case 'CLC':
                    reset = true;
                    $scope.mathString = '0';
                    break;
                case '=':
                    let endValue = 0;
                    try {
                        endValue = eval($scope.mathString);
                    } catch (error) {
                        endValue = errorString;
                        console.log(error);
                    }
                    finally {
                        reset = true;
                        if($scope.mathString!=errorString) {
                            $scope.histories.push($scope.mathString);
                            $window.localStorage.setItem('histories', JSON.stringify($scope.histories));
                        }
                        $scope.mathString = endValue
                    }
                    break;
                default:;
            }
        }
        else {
            if($scope.mathString=='0' && obj.value!='.') $scope.mathString = '';
            $scope.mathString += obj.value;
        }
        overflowChecker(reset);
    }


    $scope.checkboxClick = function() {
        $scope.showType = !$scope.showType;
        
        if(!$scope.showType) {
            setTimeout(() => {
                overflowChecker();
            }, 200);
        }
    }

    $scope.historyRetrieve = function(string) {
        $scope.mathString = string;
        $scope.checkboxClick();
    }
}]);
