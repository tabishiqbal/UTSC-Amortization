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


		$scope.createTable = function() {
			$scope.amortizationRows = [];
			var balance = $scope.loanAmount;
			$scope.totalInterest = 0;
			$scope.totalPrincipal =0;
			$scope.totalPayment = 0;
			$scope.paymentDate = $scope.firstPaymentDate;
			for (i=1; i<=$scope.getNumberOfPayments(); i++) {
				$scope.amortizationRows.push({
					index:i, 
					date: $scope.paymentDate.setMonth($scope.paymentDate.getMonth()+(12/$scope.paymentFrequency)),
					payment:$scope.getPaymentPerPeriod(), 
					interest: $scope.calInterestPortion(balance), 
					principal: $scope.calPrincipalPortion(balance),
					balance: balance-$scope.calPrincipalPortion(balance)
				});
				balance -= $scope.	calPrincipalPortion(balance);
				$scope.totalInterest += $scope.calInterestPortion(balance);
				$scope.totalPrincipal += $scope.calPrincipalPortion(balance);
				$scope.totalPayment += $scope.getPaymentPerPeriod();
				$scope.paymentDate = new Date($scope.paymentDate.setMonth($scope.paymentDate.getMonth()+(12/$scope.paymentFrequency)));
			}
			$scope.amortizationRows.push({
				index:"TOTAL", 
				date: $scope.paymentDate,
				payment:$scope.totalPayment, 
				interest: $scope.totalInterest, 
				principal: $scope.totalPrincipal,
				balance: balance
			});
		};

		$scope.calInterestPortion = function(balance) {
			return balance * $scope.getRatePerPeriod()
		};
		$scope.calPrincipalPortion = function(balance) {
			return $scope.getPaymentPerPeriod() - $scope.calInterestPortion(balance)
		};
	}]);