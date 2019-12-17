myApp.controller("inicio", function ($scope,$interval, $http, $log) {
	$scope.accionitem = "", $scope.accion = "";
	$scope.ipserver = localStorage.getItem('ipserver') || '10.10.1.244';
	$scope.puerto = localStorage.getItem('puerto') || '8088';
	$scope.organizaciones = []; $scope.bodegasept = []; $scope.ubibodegas = []; $scope.ubibodega = [];
	$scope.organizacion = "";
	$scope.bodegaept = ""; $scope.nombrelocalizacion = "";
	$scope.nombremodulo = "";
	var lectmodept = ""; $scope.tbitems = [];
	$scope.login = localStorage.getItem('login'); $scope.lecturaept = "";
	$scope.localizacion = ""; $scope.itemlocalizacion = [];
	$scope.idusuario = ""; $scope.nombreusuario = ""; $scope.usuario = ""; $scope.idorganizacion = "";
	$scope.nombreorg = ""; $scope.itemubicado = "";
	$scope.clave = localStorage.getItem('clave'); $scope.vermodulo = false; $scope.selectitem = false;
	$scope.coditem = "";
	$scope.descitem = "";
	$scope.cantenv = "";
	$scope.cantubicada = "";
	$scope.ruta = 'http://' + $scope.ipserver + ':' + $scope.puerto + '/APIH3/';
	var config = { headers: { 'content-type': 'application/json;charset=utf-8;', 'transfer-encoding': 'chunked;' } };

	// ***** VARIABLES DE PICKING *****
	$scope.ar_tipopedido = []; $scope.ar_cliente = [];
	$scope.loadchangepicking = false;
	$scope.seltipo = ""; $scope.selcliente = "";
	$scope.ar_pedido = [];
	$scope.ar_infopedido = [];
	$scope.ar_itemorganiza = [];
	$scope.ar_infoubicaitempedido = [];
	$scope.selpedido = "";
	$scope.habilitainfopedido = false;
	$scope.muestraitempedido = false;
	$scope.itemadicionado = true;
	$scope.numitempicking = 0;
	$scope.pesodoc = 0;
	$scope.genpesodoc = '';
	$scope.actuni_emb = "";
	$scope.btnguardaorg = "Guardar";
	var numbFormat = new Intl.NumberFormat("en-US");
	//***************** */

	// ******************* VARIABLES MOVIMIENTO CANASTILLA **************************
	$scope.idCanastila = '';
	$scope.canastillaObject = [];
	$scope.canastillaPendiente = [];
	$scope.idBodegaDestino = '';
	$scope.tamanhoAnterior=0;
	$scope.perfil='';
	$scope.showMontacarga='0';
	//********************************************* */

	$scope.cargarorganizacion = function () {
		// Cargar la lista de organizaciones
		$http.post($scope.ruta + 'organizaciones', config).then(function (response) {
			$scope.organizaciones = response.data;
			if (response.data.length === 1) {
			$scope.organizacion = response.data[0].id;
				setTimeout(function () {
					$('#organizacion').selectmenu('refresh');
				}, 1000); //wait one second to run function
			}
			//alert($scope.organizacion);
		}, function (response) {
			$log.info("Error al cargar Organizaciones:" + response.data);
		});
	};


	$scope.cargarorganizacion();

	$scope.guardarconfig = function (value) {
		if (value) {
			localStorage.setItem('ipserver', $scope.ipserver);
			localStorage.setItem('puerto', $scope.puerto);
			//$scope.ruta='http://'+$scope.ipserver+':'+$scope.puerto+'/APIH/';
			$scope.cargarorganizacion();
			alertify.success('Datos se ingresaron con exito!');

		}
		else {
			alertify.error('Los datos son obligatorios');
		}
	};

	$scope.validainicio = function (value) {
		if (value) {
			localStorage.setItem('login', $scope.login);
			localStorage.setItem('clave', $scope.clave);
			var data = { idorganizacion: $scope.organizacion, strusuario: $scope.login, strpassword: $scope.clave };
			$http.post($scope.ruta + 'login', data, config).then(function (response) {
				if (response.data.strnombre !== "") {

					$scope.idusuario = response.data.idusuario;
					$scope.nombreusuario = response.data.strnombre;
					$scope.usuario = response.data.strusuario;
					$scope.idorganizacion = response.data.idorganizacion;
					$scope.nombreorg = response.data.nombreorg;
					$scope.perfil= response.data.perfil;
					var temp = $scope.perfil;
					var array = temp.split(",");
					for(var i =0; i<array.length; i++){
						if(array[i]=="7"){
							$scope.showMontacarga='1';
						}
					}
					window.location.href = '#inicio';
				}
				else {
					alertify.warning('Usuario y/o constraseña sean correctos');
				}
			}, function (response) {
				$log.info("Error al logueo" + response.data);
			});
		}
	};


	// ************************ MOVIMIENTO CANASTILLA *************************************
	
	// OBTIENE LA INFORMACIÓN DE LA CANASTILLA DE ACUERDO A UN ID
	$scope.getInfoCanastilla = function () {
		$http.post($scope.ruta+'getInfoCanastilla', $scope.idCanastila, config).then(function (response) {
			if (response.data != "") {
				$scope.canastillaObject = response.data;
				document.getElementById("bodegaId").focus();
			}
			else{
				$scope.canastillaObject = [];
				alertify.error('El id de la canastilla no existe o ya ha sido entregada a la bodega destino');
			}
		}, function (response) {
			$log.info("Error al cargar Ubicación de Bodegas:" + response.data);
		});
	}
	// PERMITE ENTREGAR UNA CANASTILLA A SU BODEGA DESTINO
	$scope.entregarCanastilla = function () {
		// Cargar la lista de ubiaciones bodegas de ept
		var data = $scope.idCanastila+","+$scope.idBodegaDestino;
		if($scope.idBodegaDestino==""){
			alertify.warning('Escriba la bodega destino antes de realizar la entrega');
		}
		else{
			$http.post($scope.ruta+'entregarCanastilla', data, config).then(function (response) {
				if (response.data != "Registro Realizado") {
					$scope.idBodegaDestino='';
					alertify.error(response.data);
				}
				else{
					
					$scope.idCanastila='';
					$scope.canastillaObject = [];
					$scope.idBodegaDestino='';
					document.getElementById("canastillaId").focus();
					alertify.success(response.data);
				}
			}, function (response) {
				$log.info("Error al entregar la bodega destino:" + response.data);
			});
		}
		
	}

	// OBTIENE LAS CANASTILLAS PENDIENTES POR CUMPLIR PARA UN USUARIO ESPECIFICO
	$interval(function(){
		if($scope.usuario=="" && $scope.showMontacarga == '0'){
			
		}
		else{
			$http.post($scope.ruta+'getPendientes', $scope.usuario, config).then(function (response) {
				if (response.data != "") {
					$scope.canastillaPendiente = response.data;
					var dat=$scope.canastillaPendiente;
					if(dat.length != $scope.tamanhoAnterior){
						alertify.success("La lista de canastillas pendientes ha cambiado");
					}
					$scope.tamanhoAnterior=dat.length;
				}
				else{
					$scope.canastillaPendiente = [];
				}
			}, function (response) {
				$log.info("Error al cargar las canastillas pendietes:" + response.data);
			});
		}
	}, 5000);
	
	
});
