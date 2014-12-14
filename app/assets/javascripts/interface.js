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
		var dateRange = [];
		var interestRange = [];
		var principalRange = [];
		var balance = $scope.loanAmount;
		$scope.totalInterest = 0;
		$scope.totalPrincipal =0;
		$scope.totalPayment = 0;
		$scope.paymentDate = $scope.firstPaymentDate;
		for (i=0; i<$scope.getNumberOfPayments(); i++) {
			$scope.amortizationRows.push({
				index:i+1, 
				date: $scope.paymentDate.setMonth($scope.paymentDate.getMonth()+(12/$scope.paymentFrequency)),
				payment:$scope.getPaymentPerPeriod(), 
				interest: $scope.calInterestPortion(balance), 
				principal: $scope.calPrincipalPortion(balance),
				balance: balance-$scope.calPrincipalPortion(balance)
			});
				// create arrays
				var d = new Date($scope.amortizationRows[i].date);
				var niceMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				var niceDate = d.getDate() + "-" + niceMonths[d.getMonth()] + "-" + d.getFullYear();
				dateRange.push(niceDate);
				interestRange.push($scope.amortizationRows[i].interest);
				principalRange.push($scope.amortizationRows[i].principal);

				balance -= $scope.	calPrincipalPortion(balance);
				$scope.totalInterest += $scope.calInterestPortion(balance);
				$scope.totalPrincipal += $scope.calPrincipalPortion(balance);
				$scope.totalPayment += $scope.getPaymentPerPeriod();
				$scope.paymentDate = new Date($scope.paymentDate.setMonth($scope.paymentDate.getMonth()+(12/$scope.paymentFrequency)));

			}
			// $scope.amortizationRows.push({
			// 	index:"TOTAL", 
			// 	date: $scope.paymentDate,
			// 	payment:$scope.totalPayment, 
			// 	interest: $scope.totalInterest, 
			// 	principal: $scope.totalPrincipal,
			// 	balance: balance
			// });

// Highchart JS here!
$(function () { 
	var options = {
		chart: {
			renderTo: 'container',
			type: 'column'
		},
		title: {
			text: 'Amortization Schedule'
		},
		xAxis: {
			title: {
				text: 'Payment Period'
			},
			categories: [{}],
			labels :{
				rotation: -90
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Amortization Payment per Period'
			}
		},
		stackLabels: {
			enable: true,
			style: {
				fontWeight: 'bold',
				color:  (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
			}
		},	
		legend: {
			align: 'right',
			x: -70,
			verticalAlign: 'top',
			y: 20,
			floating: true,
			backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
			borderColor: '#CCC',
			borderWidth: 1,
			shadow: false
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.x + '</b><br/>' +
				this.series.name + ': $' + this.y.toFixed(2) + '<br/>' +
				'Total: $' + this.point.stackTotal.toFixed(2);
			}
		},
		plotOptions: {
			column: {
				stacking: 'normal'
			}
		},	

		series: [{name: 'Interest'}, {name: 'Principal'}]
	}; 
	options.xAxis.categories = dateRange;
	options.series[0].data = interestRange;
	options.series[1].data = principalRange;
	var chart = new Highcharts.Chart(options);
});
};

$scope.calInterestPortion = function(balance) {
	return balance * $scope.getRatePerPeriod()
};
$scope.calPrincipalPortion = function(balance) {
	return $scope.getPaymentPerPeriod() - $scope.calInterestPortion(balance)
};
}]);