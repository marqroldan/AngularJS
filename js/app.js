var calculatorApp = angular.module('calculatorApp', []);

calculatorApp.controller('calculatorController', function ($scope) {
    let errorString = 'Error.';
    $scope.mathString = '';
    


    $scope._buttons = [
        {value: '/'},
        {value: '*',},
        {value: '-',},
        {value: '+',},
        {value: '9',},
        {value: '8',},
        {value: '7',},
        {
            value: 'DEL',
            type: 'operation',
        },
        {value: '6',},
        {value: '5',},
        {value: '4',},
        {
            value: 'CLC',
            type: 'operation',
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

    $scope.buttonClick = function(obj) {
        if($scope.mathString==errorString) $scope.mathString='';
        if(Object.keys(obj).includes('type') && obj.type=="operation") {
            switch (obj.value) {
                case 'DEL':
                    $scope.mathString = $scope.mathString.substr(0, $scope.mathString.length-1)
                    break;
                case 'CLC':
                    $scope.mathString = '';
                    break;
                case '=':
                    try {
                        $scope.mathString = eval($scope.mathString);
                    } catch (error) {
                        $scope.mathString = errorString
                        console.log(error);
                    }
                    finally {
                        if(!$scope.mathString) {
                            $scope.mathString = ''
                            console.log("Empty eh", $scope.mathString)
                        }
                    }
                    break;
                default:;
            }
        }
        else {
            $scope.mathString += obj.value;
        }
    }
});
