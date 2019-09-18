let bg;
let maps = [];
let originalMaps = [];
let maps_hozon = [];
let metas = [];
let originalMetas = [];
let width = 1020;
let height = 645;

function setup() {
	let canvas = '';
	canvas = createCanvas(width, height);
	canvas.parent('settingmap');
	bg = loadImage("../../assets/lab3f.png");
    background(255);
    
	$.ajax({
		url:'http://localhost:3000/api/map',
		type:'GET'
	}).done( (data) => {
		if(data) { 
			originalMaps = data;
			maps = originalMaps.concat();
			for(let map of maps) {
				map.active = false;
			}
		}
	});

	$.ajax({
		url:'http://localhost:3000/api/meta',
		type:'GET'
	}).done( (data2) => {
		if(data2) { 
			originalMetas = data2;
			metas = originalMetas.concat();
			for(let meta of metas) {
				meta.active = false;
			}
		}
	});
	ellipseMode(RADIUS);

	$(".text").bind("keydown keyup keypress change",function(){
		if ($('.text').val().length > 0) {
			$('.submit').prop('disabled', false);
		}else{
			$('.submit').prop('disabled', true);
		}
	});

	$(".submit").on('click', mapSubmit);
	$(".delete").on('click',mapDelete);
}

function draw() {
    clear();
	if(bg) image(bg, 0, 0, width, height);
	if (metas.length > 0) {
		for(let meta of metas) {
			for(i = 0; meta.size.length > i; i++ ){
				fill(0,30);
				quad(meta.size[i].min.x, meta.size[i].min.y, meta.size[i].max.x, meta.size[i].min.y, 
					meta.size[i].max.x, meta.size[i].max.y, meta.size[i].min.x, meta.size[i].max.y);
            }
        }
    }
    if (maps.length > 0) {
		for(let map of maps) {
			for(i = 0; map.size.length > i; i++ ){
				fill('rgba(255,150,0,0.5)');
				quad(map.size[i].min.x, map.size[i].min.y, map.size[i].max.x, map.size[i].min.y, 
					map.size[i].max.x, map.size[i].max.y, map.size[i].min.x, map.size[i].max.y);
			}
			
			if(map.active) {
				for(i = 0; map.size.length > i; i++ ){
					fill('rgba(255,150,0,0.9)');
					quad(map.size[i].min.x, map.size[i].min.y, map.size[i].max.x, map.size[i].min.y, 
						map.size[i].max.x, map.size[i].max.y, map.size[i].min.x, map.size[i].max.y);
				}
			}
    	}
	}
	if (maps_hozon.length > 0) {
		for(i = 0; maps_hozon[0].size.length > i; i++ ){
			fill('rgba(255,0,0, 0.25)');
			quad(maps_hozon[0].size[i].min.x, maps_hozon[0].size[i].min.y, maps_hozon[0].size[i].max.x, maps_hozon[0].size[i].min.y, 
				maps_hozon[0].size[i].max.x, maps_hozon[0].size[i].max.y, maps_hozon[0].size[i].min.x, maps_hozon[0].size[i].max.y);
		}
	}
}

function mousePressed() {
	let y = mouseY;
	let metaName;
	let c = false;
	let map = maps.find(map => map.name === 'new');
	if(y < height){
		if(!map){
			for (let meta of metas) {
				for(i = 0; meta.size.length > i; i++){
					if(meta.size[i].max.x - mouseX > 0 && mouseX - meta.size[i].min.x > 0 &&
						meta.size[i].max.y - mouseY > 0 && mouseY - meta.size[i].min.y > 0){
						metaName = meta.name;
						break;
					}
				}
				if(metaName){
					maps.push({ name: 'new', size: [{min: {x: mouseX, y: mouseY}, max: {x: mouseX, y: mouseY}}], active: false, mName: metaName });
					c = true;
					break;
				}
			}
			if(!c){
				alert("先にメタを登録してください");
			}
		}else{
			maps.pop();
			metaName = null;
			c = false;
			for (let meta of metas) {
				for(i = 0; meta.size.length > i; i++){
					if(meta.size[i].max.x - mouseX > 0 && mouseX - meta.size[i].min.x > 0 &&
						meta.size[i].max.y - mouseY > 0 && mouseY - meta.size[i].min.y > 0){
						metaName = meta.name;
						break;
					} 
				}
				if(metaName){
					maps.push({ name: 'new', size: [{min: {x: mouseX, y: mouseY}, max: {x: mouseX, y: mouseY}}], active: false, mName: metaName });
					c = true;
					break;
				}
			}
			if(!c){
				alert("先にメタを登録してください");
			}
			
		}
		return false;
	}
}

function mouseReleased(){
	let y = mouseY;
	let map = maps.find(map => map.name === 'new');
	
	if(y < height){	
		if(maps_hozon.length == 0){
			maps_hozon.push({ name: 'new', size: [{min: {x: map.size[0].min.x, y: map.size[0].min.y}, max: {x: mouseX, y: mouseY}}], color:'#ff8c00', active: false });
		}else{
			maps_hozon[0].size.push(map.size[0]);
			for(i = 0; maps_hozon[0].size.length > i; i++){
				map.size[i] = maps_hozon[0].size[i];
			}
		}
		if(map.name === 'new'){
			$('[name="name"]').prop('disabled', false);
		}else{
			$('[name="name"]').prop('disabled', true); 
		}
		return false;
	}	
}

function doubleClicked() {
	if (maps.length > 0) {
		for (let map of maps) {
			for(i = 0; map.size.length > i; i++){
				if(map.size[i].max.x - mouseX > 0 && mouseX - map.size[i].min.x > 0 &&
					map.size[i].max.y - mouseY > 0 && mouseY - map.size[i].min.y > 0){
					$('[name="name"]').val([map.name]);
					map.active = true;
					break;
				} else {
					map.active = false;
				}
			}
		}
	  return false;
	}
}

function mouseDragged() {
	let y = mouseY;
	if(y < height){
		let map = maps.find(map => map.name === 'new');
		map.size[0].max = { x: mouseX, y: mouseY };
	}
}

const mapSubmit = function mapSubmit() {
	let map1 = maps.find(map => map.name === 'new');
	const mapName = $('[name="name"]').val();
	const mapSize = [];
	const metaName = map1.mName;
	let res = [];
	for(i = 0; map1.size.length > i; i++ ){
		mapSize[i] = map1.size[i] 
	}
	let map = maps.find(map => map.name === mapName);
	let meta = metas.find(meta => meta.name ===metaName);
	if(!map) { 
		map = maps.find(map => map.name === 'new');
		map.name = mapName;
		map.size = mapSize;
		map.mName = metaName;
		$.ajax({
			url:'http://localhost:3000/api/map/',
			type:'POST',
			data: JSON.stringify(map),
			contentType: "application/json; charset=utf-8"
		})
		.then((map) => {
			if(meta){
				let meta1 = metas.find(meta => meta.name ===map.mName);
				let IDList = meta1.mapIDList.concat();
				IDList.push(map.mapID);
				res.push(meta.name);
				res.push(IDList);
				$.ajax({
				url:'http://localhost:3000/api/meta',
				type:'PUT',
				data: JSON.stringify(res),
				contentType: "application/json; charset=utf-8"
				})
				window.location.reload();
			}else{
				window.location.reload();
			}
		},() => {
			alert("マップが登録されませんでした。")
		});
	}
}

const mapDelete = function mapDelete() {
	const mapName = $('[name="name"]').val();
	let res =[];
	if(mapName) {
		let map1 = maps.find(map => map.name === mapName);
		let meta = metas.find(meta => meta.name ===map1.mName);
		let IDList = meta.mapIDList.concat();
		let newIDList = IDList.filter(a => a !== map1.mapID);

		res.push(meta.name);
		res.push(newIDList);

		$.ajax({
			url:'http://localhost:3000/api/map/'+ mapName,
			type:'DELETE',
			contentType: "application/json; charset=utf-8"
		})
		.then(() => {
			$.ajax({
			url:'http://localhost:3000/api/meta',
			type:'PUT',
			data: JSON.stringify(res),
			contentType: "application/json; charset=utf-8"
			});
			window.location.reload();
		},() => {
			alert("マップが削除されませんでした。");
		});
	}else{
		alert("マップを選択してください。");
	}
}