myApp.controller("inicio", function ($scope, $http, $log) {
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
	$scope.ruta = 'http://' + $scope.ipserver + ':' + $scope.puerto + '/APIH2/';
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

	$scope.traslado = function () {

		// Cargar la lista de bodegas de ept
		$http.post($scope.ruta + 'bodegas', config).then(function (response) {
			$scope.bodegasept = response.data;
			if (response.data.length === 1) { $scope.bodegaept = response.data[0].id; $scope.cambiobodega(); }
		}, function (response) {
			$log.info("Error al cargar Bodegas:" + response.data);
		});
		setTimeout(function () {
			$('#lecturaept').focus();
		}, 50);
	};

	$scope.cambiobodega = function () {
		// Cargar la lista de ubiaciones bodegas de ept
		$http.post($scope.ruta + 'ubibodegas', $scope.bodegaept, config).then(function (response) {
			$scope.ubibodegas = response.data;
			if (response.data.length === 1) {
			$scope.ubibodega = response.data[0].id;
				setTimeout(function () {
					$('#bodegaept').selectmenu('refresh');
					$('#ubibodega').selectmenu('refresh');
				}, 1000); //wait one second to run function
				alertify.success('Bodega seleccionada con exito!');
				alertify.success('Ubicación en Bodega seleccionada con exito!');
				setTimeout(function () {
					$('#lecturaept').focus();
				}, 50);

			}
		}, function (response) {
			$log.info("Error al cargar Ubicación de Bodegas:" + response.data);
		});
		$scope.limpiartraslado();

	};
	$scope.limpiartraslado = function () {
		$scope.itemlocalizacion = [];
		$scope.selectitem = false;
		$scope.tbitems = [];
		$scope.coditem = "";
		$scope.descitem = "";
		$scope.cantenv = "";
		$scope.cantubicada = "";
		$scope.vermodulo = false;
		$scope.nombrelocalizacion = "";
		$scope.nombremodulo = "";
		$scope.itemubicado = "";
		$scope.localizacion = "";
		$scope.accionitem = "", $scope.accion = "";
	};

	$scope.buscareptdoc = function () {
		$scope.limpiartraslado();
		// Cargar ept
		$http.post($scope.ruta + 'findmoduloept', $scope.lecturaept, config).then(function (response) {

			if (response.data.length > 0) {
				$scope.nombremodulo = response.data[0].strtipo;
				//alert(response.data[0].strtipo);
				lectmodept = $scope.lecturaept;
				$scope.vermodulo = true;
				//Traer los item relacionados al eptdoc o los eptdoc
				var data = { id: 0, nombre: lectmodept };
				$http.post($scope.ruta + 'item_ept', data, config).then(function (response) {
					$scope.tbitems = response.data;
					if ($scope.tbitems.length === 0) { alertify.warning('Los ítem ya fueron ubicados con anterioridad!'); }
					else { alertify.success('Los ítem se cargaron con exito!'); }
					setTimeout(function () {
						$('#itemubicado').focus();
					}, 500);
				}, function (response) {
					$log.info("Error al cargar item de OP" + response.data);
				});
			}
			else {
				alertify.error('EPT no ha sido recibida');
			}

			$scope.lecturaept = "";
		}, function (response) {
			$log.info("Error al cargar EPT:" + response.data);
		});
	};

	$scope.buscaritemept = function () {
		$scope.nombrelocalizacion = $scope.localizacion;
		if ($scope.localizacion !== "DTUCERRAR" && $scope.accion !== "DTUELOCA" && $scope.accionitem !== "DTUELITEM") {

			if ($scope.cantubicada <= $scope.cantenv) {
				var datosenv;
				var itemlocal = [];
				angular.forEach($scope.tbitems, function (value, key) {
					if (value.barcodeh === $scope.itemubicado) {
						itemlocal.push(value);
					}
				});
				//$scope.tbitems.filter(it => it.barcodeh === $scope.itemubicado);
				angular.forEach(itemlocal, function (value, key) {
					$scope.itemlocalizacion.push({ idept: value.idept, numop: value.numop, coditem: value.coditem, descripcionitem: value.descripcionitem, cantenviada: value.cantenviada, cantubicada: $scope.cantubicada, strbodega: $scope.bodegaept, strubicacion: $scope.ubibodega, strlocalizacion: $scope.localizacion, strcanasta: $scope.nombremodulo, idorganizacion: $scope.idorganizacion, usuedit: $scope.usuario });
					datosenv = { idept: value.idept, numop: value.numop, coditem: value.coditem, descripcionitem: value.descripcionitem, cantenviada: value.cantenviada, cantubicada: $scope.cantubicada, strbodega: $scope.bodegaept, strubicacion: $scope.ubibodega, strlocalizacion: $scope.localizacion, usuedit: $scope.usuario };
				});
				$http.post($scope.ruta + 'ubicaitem_ept', datosenv, config).then(function (response) {
					if (response.data === 'OK') {
						//carga de nuevo la tabla items
						//Traer los item relacionados al eptdoc o los eptdoc
						var data = { id: 0, nombre: lectmodept };
						$http.post($scope.ruta + 'item_ept', data, config).then(function (response) {
							$scope.tbitems = response.data;
							if ($scope.tbitems.length === 0) { alertify.warning('No existe más item por ubicar por favor cerrar'); $('#local').focus(); }
							var itemactualizado = [];
							angular.forEach($scope.tbitems, function (value, key) {
								if (value.barcodeh === $scope.itemubicado) {
									itemactualizado.push(value);
								}
							});
							//var itemactualizado= $scope.tbitems.filter(it => it.barcodeh === $scope.itemubicado);
							if (itemactualizado.length === 0) { alertify.success('ítem ubicado en su totalidad!'); $scope.itemubicado = ""; }
							else { alertify.success('ítem ubicado con éxito!'); $scope.itemubicado = ""; }
						}, function (response) {
							$log.info("Error al cargar item de OP" + response.data);
						});
						$scope.localizacion = "";
						$('#itemubicado').focus();
						$scope.selectitem = false;
						$scope.coditem = "";
						$scope.descitem = "";
						$scope.cantenv = "";
						$scope.cantubicada = "";
					}
					else {
						alertify.error('ítem NO tiene ubicación');
					}

				}, function (response) {
					$log.info("Error al cargar Ubicación del item" + response.data);
				});
			}
			else {
				alertify.alert('ítem Seleccionado', 'Cantidad Ubicada No puede exceder la Cantidad Enviada');
			}
		}
		if ($scope.localizacion === 'DTUCERRAR') {
			if ($scope.tbitems.length === 0 && $scope.nombremodulo !== "") {
				$('#trasladocontenido').css('background-color', 'green');
				//se debe gnerar el dtu
				$http.post($scope.ruta + 'crearDTU', $scope.itemlocalizacion, config).then(function (response) {
					if (response.data !== "FALL") {
						$scope.limpiartraslado();
						alertify.success('CERRADO exitosamente!');
						$http.post($scope.ruta + 'generarDTU', response.data, config).then(function (response) {
							//llENADO DE DATOS DEL DTU
							$scope.codedtu = response.data.dtubarcode;
							$scope.numdtu = response.data.iddtu;
							$scope.nombrerealizo = response.data.dtuusu;
							$scope.fechadtu = response.data.dtufechacrea;
							$scope.itemdtu = response.data.ept;
							JsBarcode("#barcodedtu", $scope.codedtu, {
								width: 1.7,
								height: 60,
								quite: 10,
								format: "CODE128",
								displayValue: true,
								fontOptions: "",
								font: "monospace",
								textAlign: "center",
								fontSize: 12,
								backgroundColor: "",
								lineColor: "#000"
							});
							$('#trasladocontenido').css('background-color', '#CACFD2');
							window.location.href = '#DTU';
						}, function (response) {
							$log.info("Error al generar DTU" + response.data);
						});
					}
					else {
						alertify.error('No se logro CERRAR');
					}
				}, function (response) {
					$log.info("Error al crear DTU" + response.data);
				});
				//MOSTRAR EL DTU 
			}
			else {
				alertify.success('FALTA ítem por ubicar');

			}
		}

		if ($scope.accion === "DTUELOCA") {
			//Eliminar los item relacionados a la localización	
			$scope.datalocal = [];
			angular.forEach($scope.itemlocalizacion, function (value, key) {
				if (value.strlocalizacion === $scope.localizacion) {
					datalocal.push(value);
				}
			});
			//var datalocal =  $scope.itemlocalizacion.filter(it => it.strlocalizacion === $scope.localizacion);
			$http.post($scope.ruta + 'DTUELIMINAR', datalocal, config).then(function (response) {
				if (response.data === "OK") {

					//Traer los item relacionados al eptdoc o los eptdoc
					var data = { id: 0, nombre: lectmodept };
					$http.post($scope.ruta + 'item_ept', data, config).then(function (response) {
						$scope.tbitems = response.data;
						if ($scope.tbitems.length === 0) { alertify.warning('No existe más item por ubicar por favor cerrar'); $('#local').focus(); }
						var itemactualizado = [];
						angular.forEach($scope.tbitems, function (value, key) {
							if (value.barcodeh === $scope.itemubicado) {
								itemactualizado.push(value);
							}
						});
						//var itemactualizado= $scope.tbitems.filter(it => it.barcodeh === $scope.itemubicado);
						if (itemactualizado.length === 0) { alertify.success('ítem ubicado en su totalidad!'); $scope.itemubicado = ""; }
						else { alertify.success('Eliminación de la localización con éxito!'); $scope.itemubicado = ""; $scope.localizacion = ""; $('#local').focus(); }
					}, function (response) {
						$log.info("Error al cargar item de OP" + response.data);
					});
					$scope.accion = "";
					$scope.accionitem = "";
					$scope.itemlocalizacion = [];
					angular.forEach($scope.itemlocalizacion, function (value, key) {
						if (value.strlocalizacion !== $scope.localizacion) {
							$scope.itemlocalizacion.push(value);
						}
					});
					//$scope.itemlocalizacion= $scope.itemlocalizacion.filter(it => it.strlocalizacion !== $scope.localizacion);
				}
				else {
					alertify.error('No se logro Eliminar la Localización');
				}
			}, function (response) {
				$log.info("Error al Eliminar Localización" + response.data);
			});
		}
		if ($scope.accionitem === "DTUELITEM") {
			var dataitemlocal = [];
			angular.forEach($scope.itemlocalizacion, function (value, key) {
				if (value.strlocalizacion === $scope.localizacion && value.coditem === $scope.itemubicado) {
					dataitemlocal.push(value);
				}
			});
			//var dataitemlocal =  $scope.itemlocalizacion.filter(it => it.strlocalizacion === $scope.localizacion && it.coditem === $scope.itemubicado);
			$http.post($scope.ruta + 'DTUELIMINAR', dataitemlocal, config).then(function (response) {
				if (response.data === "OK") {
					//Traer los item relacionados al eptdoc o los eptdoc
					var data = { id: 0, nombre: lectmodept };
					$http.post($scope.ruta + 'item_ept', data, config).then(function (response) {
						$scope.tbitems = response.data;
						if ($scope.tbitems.length === 0) { alertify.warning('No existe más item por ubicar por favor cerrar'); $('#local').focus(); }
						var itemactualizado = [];
						angular.forEach($scope.tbitems, function (value, key) {
							if (value.barcodeh === $scope.itemubicado) {
								itemactualizado.push(value);
							}
						});
						//var itemactualizado= $scope.tbitems.filter(it => it.barcodeh === $scope.itemubicado);
						if (itemactualizado.length === 0) { alertify.success('ítem ubicado en su totalidad!'); $scope.itemubicado = ""; }
						else { alertify.success('Eliminación del ítem con éxito!'); $scope.itemubicado = ""; $scope.localizacion = ""; $('#itemubicado').focus(); }
					}, function (response) {
						$log.info("Error al cargar item de OP" + response.data);
					});
					$scope.accion = "";
					$scope.accionitem = "";
					$scope.itemlocalizacion = [];
					angular.forEach($scope.itemlocalizacion, function (value, key) {
						if (value.strlocalizacion !== $scope.localizacion && value.coditem !== $scope.itemubicado) {
							$scope.itemlocalizacion.push(value);
						}
					});
					// $scope.itemlocalizacion= $scope.itemlocalizacion.filter(it => it.strlocalizacion !== $scope.localizacion && it.coditem !== $scope.itemubicado)
				}
				else {
					alertify.error('No se logro Eliminar el ítem');
				}
			}, function (response) {
				$log.info("Error al Eliminar ítem" + response.data);
			});
		}
		if ($scope.localizacion === "DTUELOCA") { $scope.accion = "DTUELOCA"; $scope.localizacion = ""; $('#local').focus(); }

	};

	$scope.itemubicar = function () {
		if ($scope.itemubicado !== "DTUELITEM" && $scope.accionitem !== "DTUELITEM") {
			var itemsel = [];
			angular.forEach($scope.tbitems, function (value, key) {
				if (value.barcodeh === $scope.itemubicado) {
					itemsel.push(value);
				}
			});
			//itemsel= $scope.tbitems.filter(it => it.barcodeh === $scope.itemubicado)
			if (itemsel.length > 0) {
				$scope.selectitem = true;
				$scope.coditem = itemsel[0].coditem;
				$scope.descitem = itemsel[0].descripcionitem;
				$scope.cantenv = itemsel[0].cantenviada;
				$scope.cantubicada = itemsel[0].cantenviada;
				alertify.success('ítem seleccionado');
				$('#local').focus();
			}
			else {
				alertify.error('ítem No pertenece al modulo cargado');
			}
		}
		if ($scope.accionitem === "DTUELITEM") { $('#local').focus(); }
		if ($scope.itemubicado === "DTUELITEM") { $scope.accionitem = "DTUELITEM"; $('#itemubicado').focus(); $scope.itemubicado = ""; }
	};
	//*******************SECCIÓN PICKING METHODS ******/

	function limpiapicking() {
		$scope.ar_cliente = [];
		$scope.ar_tipopedido = [];
		$scope.ar_pedido = [];
		$scope.ar_infopedido = [];
		$scope.ar_infoubicaitempedido = [];
		$scope.selpedido = "";
		$scope.seltipo = "";
		$scope.selcliente = "";
		$scope.loadchangepicking = false;
		$scope.muestraitempedido = false;
		$scope.itembala = 1;
		setTimeout(function () {
			$('#seltipo').selectmenu('refresh');
			$('#selpedido').selectmenu('refresh');
			$('#selcliente').selectmenu('refresh');
			$('#tbitempedido').selectmenu('refresh');
			$('#tbubicaitempedido').selectmenu('refresh');
		}, 1000); //wait one second to run function
	};

	$scope.pickingcrea = function () {
		$scope.loadchangepicking = false;
		$scope.ar_tipopedido = [];
		$scope.ar_cliente = [];
		$scope.ar_pedido = [];
		$scope.ar_infopedido = [];
		$scope.ar_infoubicaitempedido = [];
		$scope.seltipo = "";
		$scope.selcliente = "";
		$scope.selpedido = "";
		$scope.muestraitempedido = false;
		$scope.mododoc = "C";

		limpiapicking();

		$http.get($scope.ruta+'getall_tipopedido', config).then(function (response) {
			$scope.ar_tipopedido = response.data;
			if (response.data.length === 1) {
				$scope.seltipo = response.data[0].id;
				setTimeout(function () {
					$('#seltipo').selectmenu('refresh');
				}, 1000); //wait one second to run function
			}

		}, function (response) {
			$log.info("Error al cargar los tipos de Pedidos" + response.data);
			Toast.fire({
				type: 'error',
				title: 'Problemas al cargar Tipo de pedidos'
			});
		});
	};

	$scope.cambiaseltipo = function () {
		$scope.loadchangepicking = true;
		$scope.ar_cliente = [];
		$scope.ar_pedido = [];
		$scope.ar_infopedido = [];
		$scope.selcliente = "";
		$scope.selpedido = "";
		$scope.muestraitempedido = false;
		setTimeout(function () {
			$('#selpedido').selectmenu('refresh');
			
		}, 1000); //wait one second to run function

		setTimeout(function () {
			
			$('#selcliente').selectmenu('refresh');
		}, 1000); //wait one second to run function


		var x = document.getElementById("seltipo").value;

		if ((x !== "") && (x !== null)) {
			$http.post($scope.ruta+'getall_cliente', $scope.seltipo).then(function (response) {
				$scope.ar_cliente = response.data;
				if (response.data.length === 1) {
					$scope.selcliente = response.data[0].id;
					setTimeout(function () {
						$('#selcliente').selectmenu('refresh');
					}, 1000); //wait one second to run function
				}
			}, function (response) {
				$log.info("Error al cargar los Clientes" + response.data);
				Toast.fire({
					type: 'error',
					title: 'Problemas al cargar Clientes'
				});
				$scope.loadchangepicking = false;
			});
		}

	};

	// $scope.cambioselcliente = function () {
	// 	$scope.loadchangepedido = true;
	// 	$scope.ar_pedido = [];
	// 	$scope.ar_infopedido = [];
	// 	$scope.ar_infoubicaitempedido = [];
	// 	$scope.selpedido = "";
	// 	$scope.muestraitempedido = false;
	// 	var valbod = $scope.selcliente;

	// 	angular.forEach($scope.ar_cliente, function (value, key) {
	// 		var valrow = value.id;
	// 		if (valrow == valbod) {
	// 			$scope.nombrecliente = value.nombre;
	// 		}
	// 	});
	// 	setTimeout(function () {
	// 		$('#selpedido').selectmenu('refresh');
	// 	}, 1000); //wait one second to run function

	// 	var x = document.getElementById("selcliente").value;
	// 	if (x != "") {
	// 		let temp = $scope.selcliente;
	// 		let data = { idcliente: temp, tipo: $scope.seltipo };
	// 		$http.post($scope.ruta+'getall_pedido', data, config).then(function (response) {
	// 			$scope.ar_pedido = response.data;
	// 			$scope.loadchangepedido = false;
	// 		}, function (response) {
	// 			$log.info("Error al cargar los Pedidos" + response.data);
	// 			Toast.fire({
	// 				type: 'error',
	// 				title: 'Problemas al cargar Pedidos'
	// 			});
	// 			$scope.loadchangepicking = false;
	// 		});
	// 	}

	// };

	// $scope.cambioselpedido = function () {
	// 	$scope.ar_infopedido = [];
	// 	$scope.ar_infoubicaitempedido = [];

	// 	//alert("cambio cliente: " + $scope.selcliente + " tipo: " +  $scope.seltipo + " habilitar: " + $scope.habilitainfopedido);	
	// 	var numped = parseInt($scope.selpedido);
	// 	$scope.muestraitempedido = false;
	// 	var valped = $scope.selpedido;
	// 	angular.forEach($scope.ar_pedido, function (value, key) {
	// 		var valrow = value.id;
	// 		if (valrow == valped) {
	// 			$scope.descped = value.nombre;
	// 		}
	// 	});
	// };

	// function limpiarvar() {
	// 	$scope.ar_infopedido = [];
	// 	$scope.ar_infoubicaitempedido = [];
	// 	$scope.ar_itemorganiza = [];
	// 	$scope.numitempicking = 0;
	// 	$scope.ar_estante = [];
	// 	$scope.ar_itemorganiza = [];
	// 	$scope.ar_ubica = [];
	// 	$scope.mododoc = "C";
	// 	$scope.numord = "";
	// 	$scope.numcanasta = "";
	// 	$scope.itdesc = "";
	// 	$scope.ordCant = 0;
	// 	$scope.selestante = "";
	// 	$scope.selubica = "";
	// 	$scope.tipofiltro = 1;
	// 	$scope.muestraitempedido = false;
	// 	$scope.itembala = 1;
	// 	$scope.pesodoc = 0;
	// 	$scope.genpesodoc = '';
	// };


	// $scope.get_infopedido = function () {

	// 	let data = { idpedido: parseInt($scope.selpedido), tipo: $scope.seltipo };
	// 	$http.post($scope.ruta+'get_infopedido', data, config).then(function (response) {
	// 		$scope.ar_infopedido = response.data;
	// 		if ($scope.ar_infopedido.length === 0) { alertify.warning('No existe item en el pedido'); $('#tbitempedido').focus(); }
	// 		if ($scope.ar_infopedido.length > 0) {
	// 			alertify.warning('Item en el pedido');
	// 			$('#tbitempedido').focus();
	// 			getall_unidad();
	// 			setTimeout(function () {
	// 				$('#tbitempedido').selectmenu('refresh');
	// 			}, 1000); //wait one second to run function	 
	// 		}
	// 	}, function (response) {
	// 		$log.info("Error al cargar informacion de los Pedidos" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar información'
	// 		});
	// 		$scope.loadchangepicking = false;
	// 	});
	// };


	// $scope.buscaitem = function (orden, desc, cant, unidad, peso) {
	// 	var resp = true;
	// 	$scope.numord = orden;
	// 	$scope.itdesc = desc;
	// 	$scope.numcanasta = "";
	// 	$scope.numbodega = "";
	// 	$scope.ordCant = cant;
	// 	$scope.maxcantitem = cant;
	// 	$scope.numunidad = unidad;
	// 	$scope.itpeso = peso;
	// 	if (cant > 0) {
	// 		get_ubicaitem();
	// 	} else {
	// 		alertify.warning('La cantidad debe ser mayor que cero');
	// 	}
	// 	return resp;
	// };

	// function get_ubicaitem() {
	// 	$scope.ar_itembodega = [];
	// 	//alertify.warning('Llamando busqueda');
	// 	let data = { idpedido: parseInt($scope.numord), tipo: $scope.seltipo };
	// 	$http.post($scope.ruta+'get_ubicaitempedido', data, config).then(function (response) {
	// 		$scope.ar_itembodega = response.data;
	// 		if ($scope.ar_itembodega.length === 0) { alertify.warning('No existe item en bodega'); $('#tbubicaitempedido').focus(); }
	// 		if ($scope.ar_itembodega.length > 0) {
	// 			alertify.warning('Item en bodega');
	// 			$('#tbubicaitempedido').focus();
	// 			setTimeout(function () {
	// 				$('#tbubicaitempedido').selectmenu('refresh');
	// 			}, 1000); //wait one second to run function	 
	// 		}
	// 	}, function (response) {
	// 		$log.info("Error al cargar item en bodega" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar información'
	// 		});
	// 	});
	// };

	// //Cargar unidades de embalaje

	// function getall_unidad() {
	// 	$scope.ar_unembala = [];
	// 	$scope.selunidad = "";

	// 	let data = { idpedido: parseInt($scope.selunidad) };
	// 	$http.post($scope.ruta+'getall_unidad', data, config).then(function (response) {
	// 		$scope.ar_unembala = response.data;
	// 		if ($scope.ar_unembala.length === 0) { alertify.warning('No existe unidades de embalaje'); $('#selun_embala').focus(); }
	// 		if ($scope.ar_unembala.length > 0) {
	// 			//         		 alertify.warning('Item en unidades de embalaje');
	// 			//         		 $('#selun_embala').focus();
	// 			setTimeout(function () {
	// 				$('#selun_embala').selectmenu('refresh');
	// 			}, 1000); //wait one second to run function	 
	// 		}
	// 	}, function (response) {
	// 		$log.info("Error al cargar unidades de embalaje" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar información'
	// 		});
	// 	});
	// };

	// //Seleccionar Unidad de embalaje
	// $scope.sel_embala = function () {
	// 	var valbod = $scope.selun_embala;
	// 	// alertify.warning('Cambiando unidad de embalaje = ' + $scope.selun_embala);
	// 	angular.forEach($scope.ar_unembala, function (value, key) {
	// 		var valrow = value.id;
	// 		//alertify.warning('seleccionado = ' + valbod + ' fila = ' + valrow);
	// 		if (valrow == valbod) {
	// 			//alertify.warning('Unidad de embalaje cambiada');
	// 			$scope.idun_embala = valbod;
	// 			$scope.actuni_emb = value.nombre;
	// 			//document.getElementById("actuni_emb").value = value.desc;
	// 			//                setTimeout(function() {
	// 			//	       			 $('#actuni_emb').selectmenu('refresh');
	// 			//	       		}, 1000); //wait one second to run function	 
	// 		}
	// 	});
	// };

	// $scope.iniciaorganiza = function (orden, desc, cant, canasta, bodega) {
	// 	var resp = true;
	// 	if (cant > 0) {
	// 		$scope.numord = orden;
	// 		$scope.itdesc = desc;
	// 		$scope.numcanasta = canasta;
	// 		$scope.numbodega = bodega;
	// 		$scope.ordCant = 1;
	// 		$scope.maxcantitem = cant;
	// 	} else {
	// 		$scope.numord = "";
	// 		$scope.itdesc = "";
	// 		$scope.numcanasta = "";
	// 		$scope.numbodega = "";
	// 		$scope.ordCant = 1;
	// 		$scope.maxcantitem = 1;
	// 		alertify.warning('La cantidad debe ser mayor que cero');
	// 	}
	// 	setTimeout(function () {
	// 		$('#ordCant').selectmenu('refresh');
	// 	}, 500);
	// 	return resp;
	// };


	// $scope.cambiacantorganiza = function () {
	// 	if ($scope.ordCant <= 0) {
	// 		$scope.ordCant = 1;
	// 		setTimeout(function () {
	// 			$('#ordCant').selectmenu('refresh');
	// 		}, 500);
	// 		alertify.warning('La cantidad debe ser mayor que cero');
	// 	} else if ($scope.ordCant > $scope.maxcantitem) {
	// 		$scope.ordCant = $scope.maxcantitem;
	// 		setTimeout(function () {
	// 			$('#ordCant').selectmenu('refresh');
	// 		}, 500);
	// 		alertify.warning('La cantidad maxima es ' + $scope.maxcantitem);
	// 	}

	// };

	// $scope.creaembala = function () {
	// 	if ($scope.itemadicionado === true) {
	// 		$scope.itembala = $scope.itembala + 1;
	// 		$scope.cantembala = $scope.ar_itemorganiza.length;
	// 		$scope.itemadicionado = false;
	// 	} else {
	// 		alertify.warning('Debe adicionar item al embalaje actual');
	// 	}
	// };

	// $scope.asignaestante = function () {

	// 	var actItem = $scope.ar_itemorganiza;

	// 	var added = false;
	// 	var txtembala = $scope.actuni_emb;
	// 	var itpeso = 0;

	// 	if (($scope.numord !== "") && ($scope.ordCant > 0)
	// 		&& ($scope.numcanasta !== "") && ($scope.actuni_emb !== "")) {

	// 		$scope.ar_itemorganiza = [];
	// 		$scope.numitempicking = 0;
	// 		$scope.pesodoc = 0;
	// 		$scope.genpesodoc = '';

	// 		angular.forEach(actItem, function (value, key) {
	// 			if (($scope.numord === value.item) && ($scope.itembala === value.id) &&
	// 				($scope.numcanasta === value.ubica) && ($scope.numbodega === value.canasta)) {
	// 				var actcant = value.cant + $scope.ordCant;
	// 				itpeso = actcant * value.peso;

	// 				$scope.ar_itemorganiza.push({
	// 					item: value.item, estante: value.estante,
	// 					cant: actcant, ubica: value.ubica, unidad: value.unidad, peso: numbFormat.format(value.peso),
	// 					pesotot: numbFormat.format(itpeso), id: value.id, embala: value.embala, emidtab: value.emidtab, canasta: value.canasta
	// 				});
	// 				added = true;
	// 				$scope.numitempicking = $scope.numitempicking + 1;
	// 			} else {
	// 				itpeso = value.cant * value.peso;
	// 				$scope.ar_itemorganiza.push({
	// 					estante: value.estante, item: value.item,
	// 					cant: value.cant, ubica: value.ubica, unidad: value.unidad, peso: numbFormat.format(value.peso),
	// 					pesotot: numbFormat.format(itpeso), id: value.id, embala: value.embala, emidtab: value.emidtab, canasta: value.canasta
	// 				});
	// 				$scope.numitempicking = $scope.numitempicking + 1;
	// 			}

	// 			$scope.pesodoc = $scope.pesodoc + itpeso;
	// 		});

	// 		if (added === false) {
	// 			itpeso = $scope.ordCant * $scope.itpeso;
	// 			$scope.ar_itemorganiza.push({
	// 				item: $scope.numord, cant: $scope.ordCant,
	// 				estante: $scope.itdesc, ubica: $scope.numcanasta,
	// 				unidad: $scope.numunidad, peso: numbFormat.format($scope.itpeso),
	// 				pesotot: numbFormat.format(itpeso)
	// 				, id: $scope.itembala, embala: txtembala, emidtab: $scope.idun_embala
	// 				, canasta: $scope.numbodega
	// 			});
	// 			$scope.pesodoc = $scope.pesodoc + itpeso;
	// 			$scope.itemadicionado = true;
	// 			$scope.numitempicking = $scope.numitempicking + 1;

	// 		}
	// 	} else {
	// 		alertify.warning('Debe seleccionar la ubicación');
	// 	}



	// 	$scope.genpesodoc = numbFormat.format($scope.pesodoc.toString());
	// 	//adicionaAlpedido();

	// 	// $scope.numcanasta = ""; 

	// };
	// $scope.removeitrow = function (x) {
	// 	var addValue = null;
	// 	var valrow = 0;
	// 	var arOrg = $scope.ar_itemorganiza;
	// 	$scope.ar_itemorganiza = [];
	// 	$scope.numitempicking = 0;
	// 	$scope.pesodoc = 0;
	// 	$scope.genpesodoc = '';
	// 	angular.forEach(arOrg, function (value, key) {
	// 		if (valrow === x) {
	// 			addValue = value;
	// 		} else {
	// 			$scope.ar_itemorganiza.push({
	// 				item: value.item, cant: value.cant,
	// 				canasta: value.canasta, estante: value.estante, ubica: value.ubica
	// 			});
	// 			$scope.numitempicking = $scope.numitempicking + 1;
	// 		}
	// 		valrow++;
	// 	});

	// };

	// $scope.guardadocorganiza = function () {

	// 	let data = {
	// 		idcliente: parseInt($scope.selcliente),
	// 		idpedido: parseInt($scope.selpedido),
	// 		nombreCliente: $scope.nombrecliente,
	// 		tipo: $scope.seltipo
	// 	};
	// 	$scope.btnguardaorg = "Guardando...";
	// 	$http.post($scope.ruta+'create_dpidoc', data, config).then(function (response) {
	// 		//alertify.warning("response int" + parseInt(response.data));
	// 		create_dpidetalle(response.data);
	// 		//crea_docpick();

	// 	}, function (response) {
	// 		$log.info("Error creando documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al crear documento picking'
	// 		});
	// 	});
	// };

	// function create_dpidetalle(iddoc) {

	// 	var arOrg = $scope.ar_itemorganiza;
	// 	var lonar = arOrg.length;
	// 	var crcont = 0;
	// 	angular.forEach(arOrg, function (value, key) {
	// 		crcont++;
	// 		let data = {
	// 			docid: parseInt(iddoc), item: value.item, cant: parseInt(value.cant),
	// 			estante: value.estante, ubica: value.ubica, canasta: value.canasta,
	// 			unidad: value.unidad, peso: value.peso,
	// 			id: value.id, embala: value.embala, emidtab: value.emidtab
	// 		};
	// 		//alertify.warning("item" + value.embala);
	// 		$http.post($scope.ruta+'create_dpidetalle', data, config).then(function (response) {

	// 			if (crcont === arOrg.length) {
	// 				$scope.ar_itemorganiza = [];
	// 				$scope.itembala = 1;
	// 				$scope.pesodoc = 0;
	// 				$scope.genpesodoc = '';
	// 				$scope.numitempicking = 0;
	// 				$scope.btnguardaorg = "Guardar";
	// 				angular.forEach(response.data, function (value, key) {
	// 					alertify.warning("Documento " + value.nombre);
	// 				});
	// 			}

	// 		}, function (response) {
	// 			$log.info("Error creando detalle picking" + response.data + "item= " + crcont);
	// 			Toast.fire({
	// 				type: 'error',
	// 				title: 'Problemas al crear detalle picking'
	// 			});
	// 		});

	// 	});
	// };

	// // //       ----

	// // function crea_docpick() {

	// // 	let data = { idpedido: parseInt($scope.selpedido), tipo: $scope.seltipo };
	// // 	$http.post('crea_docpick', data, config).then(function (response) {
	// // 		create_dpidetpick(response.data);

	// // 	}, function (response) {
	// // 		$log.info("Error creando documento picking 2" + response.data);
	// // 		Toast.fire({
	// // 			type: 'error',
	// // 			title: 'Problemas al crear documento picking 2'
	// // 		});
	// // 	});
	// // };

	// function create_dpidetpick(iddoc) {

	// 	var arOrg = $scope.ar_itemorganiza;
	// 	var lonar = arOrg.length;
	// 	var crcont = 0;
	// 	angular.forEach(arOrg, function (value, key) {
	// 		crcont++;
	// 		let data = {
	// 			docid: parseInt(iddoc), item: value.item, cant: parseInt(value.cant),
	// 			estante: value.estante, ubica: value.ubica, canasta: value.canasta,
	// 			unidad: value.unidad, peso: value.peso,
	// 			id: value.id, embala: value.embala, emidtab: value.emidtab, bodega: $scope.numbodega
	// 		};
	// 		//alertify.warning("guardando item " + crcont);
	// 		$http.post($scope.ruta+'create_dpidetpick', data, config).then(function (response) {
	// 			//alertify.warning("item guardado exitosamente");
	// 			if (crcont === arOrg.length) {
	// 				$scope.ar_itemorganiza = [];
	// 				$scope.itembala = 1;
	// 				$scope.pesodoc = 0;
	// 				$scope.genpesodoc = '';
	// 				$scope.numitempicking = 0;

	// 				angular.forEach(response.data, function (value, key) {
	// 					alertify.warning("Documento " + value.nombre);
	// 				});
	// 			}

	// 		}, function (response) {
	// 			$log.info("Error creando detalle picking 2" + response.data + "item= " + crcont);
	// 			Toast.fire({
	// 				type: 'error',
	// 				title: 'Problemas al crear detalle picking 2'
	// 			});
	// 		});

	// 	});
	// };


	// $scope.pickingedita = function () {
	// 	$scope.numord = "";
	// 	$scope.ordCant = 1;
	// 	$scope.itdesc = "";
	// 	$scope.numcanasta = "";

	// 	$scope.txtButtonSel = "Editar";
	// 	$scope.mododoc = "E";
	// 	$scope.ar_docorg = [];
	// 	$scope.seldocorg = "";
	// 	getall_docact(1);
	// };

	// $scope.pickingclosed = function () {
	// 	$scope.txtButtonSel = "Cerrar";
	// 	$scope.mododoc = "F";
	// 	$scope.ar_docorg = [];
	// 	$scope.seldocorg = "";
	// 	limpia_docdpi();
	// };


	// //Sección de Imprimir imprimeorganiza

	// $scope.pickingprint = function () {
	// 	limpia_docdpi();
	// 	$scope.txtButtonSel = "Ver";
	// 	$scope.mododoc = "I";
	// 	$scope.ar_docorg = [];
	// 	$scope.seldocorg = "";
	// 	getall_docact(2);
	// };

	// function getall_docact(x) {

	// 	let data = { tipo: x };
	// 	$http.post($scope.ruta+'getall_docdpi', data, config).then(function (response) {
	// 		llena_docact(response.data);

	// 	}, function (response) {
	// 		$log.info("Error cargar numeros de documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar numeros de documento picking'
	// 		});
	// 	});

	// 	$scope.seldocorg = "";
	// 	setTimeout(function () {
	// 		$('#seldocorg').selectmenu('refresh');
	// 	}, 1000); //wait one second to run function

	// 	limpiarvar();

	// };

	// function llena_docact(datadocum) {
	// 	$scope.ar_docorg = [];
	// 	var cont = 0;
	// 	angular.forEach(datadocum, function (value, key) {
	// 		$scope.ar_docorg.push({
	// 			id: value.id, desc: value.nombre
	// 		});
	// 		cont++;
	// 	});

	// 	if (cont > 0) {
	// 		//$('#modal_editadocorg').modal('open');
	// 	} else {
	// 		$scope.$apply(function () {
	// 			alertify.warning('No se encontraron documentos');
	// 		});
	// 	}
	// };

	// $scope.infodocumento = function () {
	// 	var x = document.getElementById("seldocorg").value;

	// 	if ((x !== "") && (x !== null)) {
	// 		if ($scope.txtButtonSel == "Editar") {
	// 			getinfodoc();
	// 		} else if ($scope.txtButtonSel == "Cerrar") {
	// 			close_docdpi();
	// 		} else if ($scope.txtButtonSel == "Ver") {
	// 			print_doc();
	// 		}
	// 	} else {
	// 		alertify.warning('No se selecciono un documento');
	// 	}

	// };

	// function print_doc() {
	// 	sel_docorg();
	// 	get_dpihead();

	// };

	// function sel_docorg() {
	// 	var valbod = $scope.seldocorg;
	// 	angular.forEach($scope.ar_docorg, function (value, key) {
	// 		var valrow = value.id;
	// 		if (valrow == valbod) {
	// 			$scope.editdoc = value.desc;
	// 		}
	// 	});
	// };


	// function get_dpihead() {

	// 	let data = { tipo: $scope.seldocorg };
	// 	$http.post($scope.ruta+'get_dpihead', data, config).then(function (response) {
	// 		infohead(response.data);

	// 	}, function (response) {
	// 		$log.info("Error cargar encabezado de documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar encabezado de documento picking'
	// 		});
	// 	});
	// };

	// function infohead(datadoc) {

	// 	$scope.usua = datadoc.optusu;
	// 	$scope.fecagrup = datadoc.optfec;
	// 	$scope.optbarcode = datadoc.optbarcode;
	// 	JsBarcode("#barcodedpi", $scope.optbarcode, {
	// 		width: 1.7,
	// 		height: 60,
	// 		quite: 10,
	// 		format: "CODE128",
	// 		displayValue: true,
	// 		fontOptions: "",
	// 		font: "monospace",
	// 		textAlign: "center",
	// 		fontSize: 12,
	// 		backgroundColor: "",
	// 		lineColor: "#000"
	// 	});
	// 	window.location.href = '#pickingdoc';
	// 	get_dpidetalle();

	// };

	// function get_dpidetalle() {

	// 	let data = { tipo: $scope.seldocorg };
	// 	$http.post($scope.ruta+'get_dpidetalle', data, config).then(function (response) {
	// 		infodoc_ar(response);

	// 	}, function (response) {
	// 		$log.info("Error cargar detalle de documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar detalle de documento picking'
	// 		});
	// 	});
	// };

	// function infodoc_ar(datadoc) {
	// 	$scope.ar_itemorganiza = [];
	// 	$scope.pesodoc = 0;
	// 	$scope.genpesodoc = '';
	// 	$scope.numitempicking = 0;
	// 	angular.forEach(datadoc.data, function (value, key) {
	// 		var myId = value.val_id;
	// 		var myPeso = value.peso * value.cant;
	// 		$scope.ar_itemorganiza.push({
	// 			item: value.item, cant: value.cant,
	// 			canasta: value.canasta, estante: value.estante, ubica: value.ubica,
	// 			unidad: value.unidad, peso: numbFormat.format(value.peso),
	// 			pesotot: numbFormat.format(myPeso),
	// 			id: myId, embala: value.embala, emidtab: value.emidtab
	// 		});

	// 		$scope.pesodoc = $scope.pesodoc + myPeso;
	// 		$scope.numitempicking = $scope.numitempicking + 1;
	// 	});
	// 	$scope.genpesodoc = numbFormat.format($scope.pesodoc.toString());
	// 	if ($scope.numitempicking === 0) {
	// 		alertify.warning("Problemas al cargar información ");
	// 	}
	// };

	// $scope.buscardocpic = function () {
	// 	var x = document.getElementById("lecturadocpic").value;
	// 	$scope.ar_itemorganizacum = [];
	// 	$scope.ar_bodegasdocpic = [];
	// 	$scope.cumpleiddoc = "";
	// 	$scope.cumplebarcodedoc = "";

	// 	setTimeout(function () {
	// 		$('#bodegadocpic').selectmenu('refresh');
	// 	}, 1000); //wait one second to run function

	// 	if ((x !== "") && (x !== null)) {
	// 		let data = { tipo: $scope.lecturadocpic };

	// 		$http.post($scope.ruta+'get_dpiheadbycode', data, config).then(function (response) {
	// 			var estadodoc = parseInt(response.data.optest);
	// 			$scope.cumpleiddoc = response.data.iddtu;
	// 			$scope.cumplebarcodedoc = response.data.optbarcode;

	// 			if (response.data === []) {
	// 				alertify.warning('El documento no esta registrado');
	// 			} else {
	// 				if (estadodoc === 1) {
	// 					$scope.cargabodega = true;
	// 					get_dpidetallevalido();

	// 				} else {
	// 					alertify.warning('El documento esta cumplido o no existe');
	// 				}
	// 			}

	// 			//infohead(response.data);

	// 		}, function (response) {
	// 			$log.info("Error cargar encabezado de documento picking" + response.data);
	// 			Toast.fire({
	// 				type: 'error',
	// 				title: 'Problemas al cargar encabezado de documento picking'
	// 			});
	// 		});
	// 	} else {
	// 		alertify.warning('No se selecciono un documento');
	// 	}

	// };

	// function get_dpidetallevalido() {
	// 	let data = { tipo: $scope.lecturadocpic };
	// 	$http.post($scope.ruta+'get_dpidetallecumplido', data, config).then(function (response) {

	// 		infodoc_arcumplido(response.data);

	// 	}, function (response) {
	// 		alertify.warning("Error cargar detalle de documento picking");
	// 		$log.info("Error cargar detalle de documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar detalle de documento picking'
	// 		});
	// 	});
	// };

	// function infodoc_arcumplido(datadoc) {
	// 	$scope.ar_itemorganizacum = [];

	// 	if ($scope.cargabodega === true) {
	// 		//alertify.warning("cargabodegas true");
	// 		$scope.ar_bodegasdocpic = [];
	// 		$scope.bodegadocpic = "";
	// 	}

	// 	$scope.pesodoc = 0;
	// 	$scope.genpesodoc = '';
	// 	$scope.numporcumplir = 0;
	// 	var tmp_ardata = datadoc;
	// 	var cont = 0;
	// 	//alertify.warning("En infodoc_arcumplido");
	// 	if (tmp_ardata.length === 0) {
	// 		alertify.warning("No hay items por cumplir ");
	// 	} else {
	// 		//alertify.warning("Iniciar carga de datos ");
	// 		angular.forEach(tmp_ardata, function (value, key) {
	// 			cont++;
	// 			var myId = value.val_id;
	// 			var cumple = value.cumplido;
	// 			var myPeso = value.peso * value.cant;
	// 			//alertify.warning("cargar detalle de documento picking " + cont);
	// 			$scope.ar_itemorganizacum.push({
	// 				item: value.item, cant: value.cant,
	// 				canasta: value.canasta, estante: value.estante, ubica: value.ubica,
	// 				unidad: value.unidad, peso: numbFormat.format(value.peso),
	// 				pesotot: numbFormat.format(myPeso),
	// 				id: myId, embala: value.embala, emidtab: value.emidtab, cumplido: value.cumplido
	// 			});

	// 			$scope.pesodoc = $scope.pesodoc + parseInt(myPeso);

	// 			if ($scope.cargabodega === true) {
	// 				//alertify.warning("Filtrar bodega " + value.canasta);
	// 				if (($scope.ar_bodegasdocpic !== [])) {
	// 					//alertify.warning("Filtrar bodega " + value.canasta);
	// 					let ar_porcumplir = $scope.ar_bodegasdocpic.filter(it => it.nombre === value.canasta);

	// 					//alertify.warning("Filtro aplicado" + value.canasta);
	// 					if ((ar_porcumplir.length === 0)) {
	// 						$scope.ar_bodegasdocpic.push({ id: value.canasta, nombre: value.canasta });
	// 						//alertify.warning("Adiciona bodega 1" + value.canasta);
	// 					} else {
	// 						// alertify.warning("La bodega ya existe");
	// 					}
	// 				} else {
	// 					$scope.ar_bodegasdocpic.push({ id: value.canasta, nombre: value.canasta });
	// 					//alertify.warning("Adiciona bodega 2" + value.canasta);
	// 				}


	// 			}


	// 		});

	// 		var objCumple = $scope.ar_itemorganizacum;
	// 		//alertify.warning("Filtrar cumplidos ");
	// 		let ar_porcumplir = objCumple.filter(it => it.cumplido === '0');
	// 		$scope.numporcumplir = ar_porcumplir.length;
	// 		alertify.warning("Tiene " + $scope.numporcumplir + " items por cumplir");
	// 		if ($scope.numporcumplir === 0) {
	// 			// alertify.warning("cumplir documento");
	// 			$scope.selectitem = false;
	// 			close_docdpi();
	// 		} else {
	// 			$scope.selectitem = true;
	// 		}
	// 		//alertify.warning("Numero cumplidos " + $scope.numporcumplir);
	// 		$scope.genpesodoc = numbFormat.format($scope.pesodoc);
	// 		if ($scope.cargabodega === true) {
	// 			if ($scope.ar_bodegasdocpic.length > 0) {

	// 				if ($scope.ar_bodegasdocpic.length === 1) {
	// 					$scope.bodegadocpic = $scope.ar_bodegasdocpic[0].id;
	// 				}

	// 				$scope.cargabodega = false;
	// 				setTimeout(function () {
	// 					$('#bodegadocpic').selectmenu('refresh');
	// 				}, 1000); //wait one second to run function
	// 			}
	// 		}
	// 	}

	// };


	// $scope.buscaritemdocpic = function () {
	// 	//alertify.warning("Iniciando revision cumplimiento");

	// 	if (($scope.lecturaitempi !== "") && (typeof ($scope.lecturaitempi) != "undefined")) {
	// 		var codeItem = $scope.lecturaitempi;
	// 		if (codeItem.length === 20) {
	// 			$scope.lecturaitempi = parseInt(codeItem.substring(0, 7));
	// 		}
	// 	}

	// 	if ($scope.ar_itemorganizacum.length === 0) {
	// 		alertify.warning("No hay items por cumplir");

	// 	} else {
	// 		//alertify.warning("Verificando datos");
	// 		if (($scope.ar_itemorganizacum !== []) && ($scope.ar_itemorganizacum.length > 0) &&
	// 			($scope.bodegadocpic !== "") && (typeof ($scope.bodegadocpic) != "undefined") &&
	// 			($scope.lecturaubicapic !== "") && (typeof ($scope.lecturaubicapic) != "undefined") &&
	// 			($scope.lecturaitempi !== "") && (typeof ($scope.lecturaitempi) != "undefined")) {

	// 			var hasitem = false;
	// 			var hasbodega = false;
	// 			var hasubica = false;
	// 			//alertify.warning("Verificando item");       		       
	// 			var objCumple = $scope.ar_itemorganizacum;
	// 			let ar_porcumplir = objCumple.filter(it => it.item.toString().trim() == $scope.lecturaitempi.toString().trim());
	// 			$scope.numporcumplir = ar_porcumplir.length;
	// 			//alertify.warning("filtro item = " + $scope.numporcumplir);
	// 			if ($scope.numporcumplir >= 0) {
	// 				//alertify.warning("Tiene item"); 
	// 				objCumple = ar_porcumplir;
	// 				hasitem = true;
	// 			} else {
	// 				alertify.warning("el item no corresponde al documento");
	// 			}

	// 			//alertify.warning("Verificando bodega"); 
	// 			ar_porcumplir = objCumple.filter(it => it.canasta.toString().trim() == $scope.bodegadocpic.toString().trim());
	// 			$scope.numporcumplir = ar_porcumplir.length;
	// 			//alertify.warning("filtro bodega = " + $scope.numporcumplir);
	// 			if ($scope.numporcumplir >= 0) {
	// 				//alertify.warning("Tiene bodega"); 
	// 				objCumple = ar_porcumplir;
	// 				hasbodega = true;
	// 			} else {
	// 				alertify.warning("la bodega no corresponde al documento");
	// 			}

	// 			//alertify.warning("valor ubicación = " + $scope.lecturaubicapic);
	// 			ar_porcumplir = objCumple.filter(it => it.ubica.toString().trim() == $scope.lecturaubicapic.toString().trim());
	// 			$scope.numporcumplir = ar_porcumplir.length;
	// 			//alertify.warning("filtro ubicaciÒN = " + $scope.numporcumplir);
	// 			if ($scope.numporcumplir >= 0) {
	// 				// alertify.warning("Tiene ubicacion"); 
	// 				objCumple = ar_porcumplir;
	// 				hasubica = true;
	// 			} else {
	// 				alertify.warning("la ubicación no corresponde al documento");
	// 			}

	// 			if ((hasitem === true) && (hasbodega === true) && (hasubica === true)) {
	// 				//alertify.warning("envia a cumplir =");
	// 				cumpliritem(objCumple);
	// 			}

	// 		} else {
	// 			//alertify.warning("La información ingresada no corresponde al documento");
	// 		}
	// 	}

	// };


	// function cumpliritem(ar_datacumplir) {
	// 	//alertify.warning("Entrando a cumplir"); 
	// 	var arOrg = ar_datacumplir;
	// 	var lonar = arOrg.length;
	// 	var crcont = 0;
	// 	angular.forEach(arOrg, function (value, key) {
	// 		crcont++;
	// 		let data = {
	// 			docid: parseInt($scope.cumpleiddoc), item: value.item, cant: parseInt(value.cant),
	// 			estante: value.estante, ubica: value.ubica, canasta: $scope.cumplebarcodedoc,
	// 			unidad: value.unidad, peso: value.peso,
	// 			id: value.id, embala: value.embala, emidtab: value.emidtab, bodega: value.canasta
	// 		};


	// 		//alertify.warning("guardando item " + crcont);
	// 		$http.post($scope.ruta+'cumple_dpidetpick', data, config).then(function (response) {
	// 			//alertify.warning("item cumplido" + crcont + " - " + value.item);
	// 			if (crcont === arOrg.length) {
	// 				//alertify.warning("item cumplido " + value.nombre);
	// 				get_dpidetallevalido();
	// 				$scope.lecturaubicapic = "";
	// 				setTimeout(function () {
	// 					$('#lecturaubicapic').selectmenu('refresh');
	// 				}, 1000); //wait one second to run function

	// 				$scope.lecturaitempi = "";
	// 				setTimeout(function () {
	// 					$('#lecturaitempi').selectmenu('refresh');
	// 				}, 1000); //wait one second to run function
	// 			}

	// 		}, function (response) {
	// 			$log.info("Error cumpliendo el picking" + response.data + "item= " + crcont);
	// 			Toast.fire({
	// 				type: 'error',
	// 				title: 'Problemas al cumplir el picking'
	// 			});
	// 		});

	// 	});
	// };

	// function close_docdpi() {
	// 	let data = { idpedido: $scope.cumpleiddoc, nombrePedido: $scope.cumplebarcodedoc };
	// 	$http.post($scope.ruta+'close_docdpi', data, config).then(function (response) {
	// 		alertify.warning("El documento esta cumplido ");
	// 		limpiadatoscumplido();

	// 	}, function (response) {
	// 		$log.info("Error cerrar de documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cerrar documento picking'
	// 		});
	// 	});
	// };

	// function limpia_docdpi() {
	// 	$scope.ar_itemorganizacum = [];
	// 	$scope.ar_bodegasdocpic = [];
	// 	$scope.cumpleiddoc = "";
	// 	$scope.cumplebarcodedoc = "";
	// 	$scope.lecturadocpic = "";
	// 	$scope.bodegadocpic = "";
	// 	$scope.lecturaitempi = "";
	// 	$scope.lecturadocpic = "";
	// 	$scope.lecturaubicapic = "";

	// 	$scope.lecturaubicapic = "";
	// 	setTimeout(function () {
	// 		$('#lecturaubicapic').selectmenu('refresh');
	// 	}, 1000); //wait one second to run function

	// 	$scope.lecturaitempi = "";
	// 	setTimeout(function () {
	// 		$('#lecturaitempi').selectmenu('refresh');
	// 	}, 1000); //wait one second to run function

	// 	$scope.lecturaubicapic = "";
	// 	setTimeout(function () {
	// 		$('#lecturadocpic').selectmenu('refresh');
	// 	}, 1000); //wait one second to run function

	// 	$scope.lecturaitempi = "";
	// 	setTimeout(function () {
	// 		$('#lecturaitempi').selectmenu('refresh');
	// 	}, 1000); //wait one second to run function

	// };

	// function getinfodoc() {
	// 	sel_docorg();
	// 	get_editdpihead();

	// };

	// function get_editdpihead() {

	// 	let data = { nombrePedido: $scope.editdoc };
	// 	$http.post($scope.ruta+'get_infopedidotiponumero', data, config).then(function (response) {
	// 		$scope.selpedido = response.data[0].id;
	// 		$scope.seltipo = response.data[0].nombre;
	// 		get_infoclientebypick();

	// 	}, function (response) {
	// 		$log.info("Error cargar encabezado de documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar encabezado de documento picking'
	// 		});
	// 	});
	// };

	// function get_infoclientebypick() {

	// 	let data = { nombrePedido: $scope.editdoc };
	// 	$http.post($scope.ruta+'get_infoclientebypick', data, config).then(function (response) {
	// 		$scope.selcliente = response.data[0].id;
	// 		$scope.nombrecliente = response.data[0].nombre;
	// 		window.location.href = '#pickingedita';
	// 		$scope.get_infopedido();
	// 		get_dpidetalle();
	// 	}, function (response) {
	// 		$log.info("Error cargar encabezado de documento picking" + response.data);
	// 		Toast.fire({
	// 			type: 'error',
	// 			title: 'Problemas al cargar encabezado de documento picking'
	// 		});
	// 	});
	// };

	// $scope.guardadocedita = function () {
	// 	var valbod = $scope.seldocorg;

	// 	let data = { idpedido: $scope.seldocorg, nombrePedido: $scope.editdoc };
	// 	alertify.warning('Iniciando edición');

	// 	if ($scope.numitempicking > 0) {
	// 		//alertify.warning('Eliminando detalle');
	// 		$http.post($scope.ruta+'delete_dpidetalle', data, config).then(function (response) {
	// 			var numdel = parseInt(response.data);
	// 			if (numdel > 0) {
	// 				//alertify.warning('Creando nuevo detalle');
	// 				create_dpidetalle(valbod);
	// 				delete_pickdet();
	// 			} else {
	// 				alertify.warning('No se actualizo el documento');
	// 			}

	// 		}, function (response) {
	// 			$log.info("Error cargar encabezado de documento picking" + response.data);
	// 			Toast.fire({
	// 				type: 'error',
	// 				title: 'Problemas al cargar encabezado de documento picking'
	// 			});
	// 		});
	// 	} else {
	// 		alertify.warning("Debe agregar elementos al picking");
	// 	}

	// };

	// function delete_pickdet() {
	// 	var valbod = $scope.seldocorg;
	// 	let data = { idpedido: $scope.seldocorg, nombrePedido: $scope.editdoc };

	// 	if ($scope.numitempicking > 0) {
	// 		$http.post($scope.ruta+'delete_pickdet', data, config).then(function (response) {
	// 			var numdel = parseInt(response.data);
	// 			if (numdel > 0) {
	// 				//alertify.warning('Creando nuevo detalle picking #');
	// 				create_dpidetpick(numdel);
	// 			} else {
	// 				alertify.warning('No se actualizo el documento picking #');
	// 			}

	// 		}, function (response) {
	// 			$log.info("Error cargar encabezado de documento picking" + response.data);
	// 			Toast.fire({
	// 				type: 'error',
	// 				title: 'Problemas al cargar encabezado de documento picking'
	// 			});
	// 		});
	// 	} else {
	// 		alertify.warning("Debe agregar elementos al picking #");

	// 	}

	// };

	// $scope.imprimirPdf = function () {
	// 	alertify.warning("creando pdf al picking #" + $scope.optbarcode);

	// 	var options = {
	// 	};
	// 	var pdf = new jsPDF('p', 'pt', 'letter');
	// 	pdf.addHTML($("#pdfcontent"), 15, 15, options, function () {
	// 		pdf.save($scope.optbarcode + '.pdf');
	// 	});

	// };


});
