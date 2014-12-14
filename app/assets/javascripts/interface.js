angular.module('amortization', [])
	.controller('amortCtrl', ['$scope', function($scope) {
		$scope.getNumberOfPayments = function() {
			return $scope.termOfLoan * $scope.paymentFrequency
		};

		$scope.getRatePerPeriod  = function() {
			return Math.pow((1+$scope.annualInterestRate/$scope.compoundPeriod), ($scope.compoundPeriod/$scope.paymentFrequency)) - 1
		};

		$scope.getPaymentPerPeriod = function() {
			var onePlusRtoPowerOfN = Math.pow((1+$scope.getRatePerPeriod()), $scope.getNumberOfPayments())
			return $scope.loanAmount * $scope.getRatePerPeriod() * onePlusRtoPowerOfN/(onePlusRtoPowerOfN-1)
		};

		$scope.amortizationRows = [];

		$scope.createTable = function() {
				var balance = $scope.loanAmount;
			for (i=1; i<=$scope.getNumberOfPayments(); i++) {
				$scope.amortizationRows.push({
					index:i, 
					payment:$scope.getPaymentPerPeriod(), 
					interest: $scope.calInterestPortion(balance), 
					principal: $scope.calPrincipalPortion(balance),
					balance: balance-$scope.calPrincipalPortion(balance)
				});
				balance = balance - $scope.calPrincipalPortion(balance);
			}

		};

		$scope.calInterestPortion = function(balance) {
			return balance * $scope.getRatePerPeriod()
		};
		$scope.calPrincipalPortion = function(balance) {
			return $scope.getPaymentPerPeriod() - $scope.calInterestPortion(balance)
		};
	}]);