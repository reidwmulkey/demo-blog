(function() {
    'use strict';

    function mdtCheckboxColumnFilterDirective(_){
        return{
            restrict: 'E',
            templateUrl: '/main/templates/mdtCheckboxColumnFilter.html',
            scope: {
                confirmCallback: '=',
                cancelCallback: '&',
                headerRowData: '='
            },
            link: function($scope){

                $scope.transformChip = transformChip;
                $scope.selectableItems = [];
                $scope.selectedItems = _.map($scope.headerRowData.columnFilter.filtersApplied, _.clone);

                $scope.headerRowData.columnFilter.valuesProviderCallback().then(function(values){
                    if(values){
                        $scope.selectableItems = values
                    }
                });

                $scope.exists = function (item) {
                    var result = _.findIndex($scope.selectedItems, function(arrayItem){
                        return transformChip(arrayItem) === transformChip(item);
                    });

                    return result != -1;
                };

                $scope.toggle = function (item) {
                    var idx = _.findIndex($scope.selectedItems, function(arrayItem){
                        return transformChip(arrayItem) === transformChip(item);
                    });

                    if (idx > -1) {
                        $scope.selectedItems.splice(idx, 1);
                    }
                    else {
                        $scope.selectedItems.push(item);
                    }
                };

                function transformChip(chip) {
                    if($scope.headerRowData.columnFilter.valuesTransformerCallback){
                        return $scope.headerRowData.columnFilter.valuesTransformerCallback(chip);
                    }

                    return chip;
                }
            }
        }
    }

    angular
        .module('mdDataTable')
        .directive('mdtCheckboxColumnFilter', mdtCheckboxColumnFilterDirective);
})();