// 전역 변수 선언
let map;
let markers = []; // 마커를 저장할 배열

// 상수 정의 (kakao 객체를 사용하지 않는 부분)
const MAP_CONFIG = {
	DEFAULT_LEVEL: 2,
	MARKER_IMAGE: '../../assets/imgs/img/map_marker.png',
	MARKER_SIZE: { width: 137, height: 106 }
};

// 도/시 데이터
const provinceData = {
	서울: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
	경기: ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '양주시', '포천시', '여주시', '연천군', '가평군', '양평군'],
	부산: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
	인천: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
	대구: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
	광주: ['동구', '서구', '남구', '북구', '광산구'],
	대전: ['동구', '중구', '서구', '유성구', '대덕구'],
	울산: ['중구', '남구', '동구', '북구', '울주군'],
	세종: ['세종시 가람동', '세종시 고운동', '세종시 금남면', '세종시 나성동', '세종시 다정동', '세종시 대평동', '세종시 도담동', '세종시 반곡동', '세종시 보람동', '세종시 부강면', '세종시 새롬동', '세종시 소담동', '세종시 소정면', '세종시 아름동', '세종시 연기면', '세종시 연동면', '세종시 연서면', '세종시 장군면', '세종시 전동면', '세종시 전의면', '세종시 조치원읍', '세종시 종촌동', '세종시 한솔동', '세종시 해밀동'],
	강원: ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
	충북: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군'],
	충남: ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
	전북: ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
	전남: ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
	경북: ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
	경남: ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
	제주: ['제주시 건입동', '제주시 노형동', '제주시 도두동', '제주시 봉개동', '제주시 삼도1동', '제주시 삼도2동', '제주시 아라동', '제주시 연동', '제주시 오라동', '제주시 외도동', '제주시 용담1동', '제주시 용담2동', '제주시 이도1동', '제주시 이도2동', '제주시 조천읍', '제주시 추자면', '제주시 한경면', '제주시 한림읍', '제주시 화북동', '서귀포시 강정동', '서귀포시 남원읍', '서귀포시 대륜동', '서귀포시 대천동', '서귀포시 동홍동', '서귀포시 서홍동', '서귀포시 송산동', '서귀포시 안덕면', '서귀포시 영천동', '서귀포시 예래동', '서귀포시 중문동', '서귀포시 중앙동', '서귀포시 천지동', '서귀포시 표선면', '서귀포시 하원동', '서귀포시 호근동']
};

// 옵션 데이터
const optionData = {
	storeType: {
		name: '매장타입',
		options: [
			{ value: 'A', text: 'BR 31' },
			{ value: 'B', text: '100flavor' },
		],
	},
	serviceInfo: {
		name: '제공 서비스',
		options: [
			{ value: 'A', text: '주차' },
			{ value: 'B', text: '배달' },
			{ value: 'C', text: '픽업' },
			{ value: 'D', text: '취식여부' },
			{ value: 'E', text: '해피스테이션' },
			{ value: 'F', text: '가챠머신' },
			{ value: 'I', text: 'KT 제휴' },
			{ value: 'J', text: 'SKT 제휴' },
			{ value: 'K', text: 'LGU+ 제휴' },
			{ value: 'L', text: '맛보기 제휴' },
		],
	},
};

// 카카오맵 API가 로드된 후 실행될 초기화 함수
function initializeMap() {
	// kakao 객체를 사용하는 코드는 여기서 실행
	const DEFAULT_POSITION = new kakao.maps.LatLng(37.498095, 127.02761);
	
	map = new kakao.maps.Map(document.getElementById('map'), {
		center: DEFAULT_POSITION,
		level: MAP_CONFIG.DEFAULT_LEVEL
	});

	// 초기 마커 설정
	const centerMarker = createMarker(DEFAULT_POSITION, '현재 위치');
	centerMarker.setMap(map);

	// 커스텀 오버레이 설정
	setupCustomOverlay(DEFAULT_POSITION);
}

// 커스텀 오버레이 설정
function setupCustomOverlay(position) {
	const content = '<div class="customoverlay">' +
		'  <a href="https://www.baskinrobbins.co.kr/store/map.php" target="_blank">' +
		'    <span class="title">Minoos</span>' +
		'  </a>' +
		'</div>';

	const customOverlay = new kakao.maps.CustomOverlay({
		map: map,
		position: position,
		content: content,
		yAnchor: 1
	});
}

// 마커 생성 함수
function createMarker(position, title) {
	return new kakao.maps.Marker({
		position: position,
		title: title,
		image: createCustomMarker(
			MAP_CONFIG.MARKER_IMAGE,
			MAP_CONFIG.MARKER_SIZE
		)
	});
}

// 커스텀 마커 이미지 생성 함수
function createCustomMarker(imageUrl, size) {
	return new kakao.maps.MarkerImage(
		imageUrl,
		new kakao.maps.Size(size.width, size.height),
		{
			offset: new kakao.maps.Point(size.width / 2, size.height / 2),
			alt: '마커 이미지'
		}
	);
}

// 이벤트 리스너 설정
function setupEventListeners() {
	document.getElementById('search-button').addEventListener('click', searchPlaces);
	document.getElementById('search_keyword').addEventListener('keypress', e => {
		if (e.key === 'Enter') searchPlaces();
	});
	
	// 도/시 선택 이벤트
	const provinceSelect = document.getElementById('province-select');
	if (provinceSelect) {
		provinceSelect.addEventListener('change', handleProvinceChange);
		initializeProvinceSelect();
	}

	// 지도 이동이 끝나면 해당 지역의 베스킨라빈스 매장 검색
	kakao.maps.event.addListener(map, 'dragend', function() {
		searchBaskinRobbins();
	});

	// 지도 줌 레벨이 변경되면 해당 지역의 베스킨라빈스 매장 검색
	kakao.maps.event.addListener(map, 'zoom_changed', function() {
		
		
		// 줌 레벨에 따른 반경 조정 (더 세밀한 조정)
		const zoomLevel = map.getLevel();
		let radius;
		
		// 줌 레벨에 따라 반경을 다르게 설정
		if (zoomLevel <= 3) { // 매우 넓은 영역
			radius = 7000; // 7km
		} else if (zoomLevel <= 5) { // 넓은 영역
			radius = 3000; // 3km
		} else if (zoomLevel <= 7) { // 중간 영역
			radius = 1500; // 1.5km
		} else { // 좁은 영역
			radius = 1000; // 1km
		}

		// 기존 마커 제거
		removeAllMarkers();

		// 장소 검색 객체 생성
		const ps = new kakao.maps.services.Places();
		
		// 장소 검색 실행
		ps.keywordSearch('베스킨라빈스', (data, status) => {
			if (status === kakao.maps.services.Status.OK) {
				// 현재 지도 영역 내의 장소만 필터링
				const filteredPlaces = data.filter(place => {
					const placeLatLng = new kakao.maps.LatLng(place.y, place.x);
					return map.getBounds().contain(placeLatLng);
				});
				
				// 필터링된 장소만 표시
				displayPlaces(filteredPlaces);
			} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
				console.log('검색 결과가 없습니다.');
			} else if (status === kakao.maps.services.Status.ERROR) {
				console.error('검색 중 오류가 발생했습니다.');
			}
		});
	});
}

// 검색 관련 이벤트 리스너 설정
document.getElementById('search-button').addEventListener('click', searchPlaces);
document.getElementById('search_keyword').addEventListener('keypress', e => {
	if (e.key === 'Enter') searchPlaces();
});

// 장소 검색 함수
function searchPlaces() {
	const keyword = document.getElementById('search_keyword').value;
	if (!keyword.trim()) {
		alert('검색어를 입력해주세요.');
		return;
	}

	
	const ps = new kakao.maps.services.Places();
	ps.keywordSearch(keyword, handleSearchResult);
}

// 검색 결과 처리 함수
function handleSearchResult(data, status) {
	

	if (status === kakao.maps.services.Status.OK) {
		displayPlaces(data);
		adjustMapBounds(data);
	} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
		alert('검색 결과가 존재하지 않습니다.');
	} else if (status === kakao.maps.services.Status.ERROR) {
		alert('검색 중 오류가 발생했습니다.');
	}
}

// 지도 범위 조정 함수
function adjustMapBounds(data) {
	if (data.length > 0) {
		const bounds = new kakao.maps.LatLngBounds();
		data.forEach(place => {
			bounds.extend(new kakao.maps.LatLng(place.y, place.x));
		});
		map.setBounds(bounds);
	}
}

// 도/시 선택 이벤트 처리
function handleProvinceChange(event) {
	const province = event.target.value;
	const citySelect = document.getElementById('city-select');
	
	// 구/군 선택 옵션 초기화
	citySelect.innerHTML = '<option value="">구/군 선택</option>';
	
	if (province) {
		const districts = provinceData[province];
		citySelect.disabled = false;
		
		// 구/군 옵션 추가
		districts.forEach(district => {
			citySelect.appendChild(new Option(district, district));
		});
	} else {
		citySelect.disabled = true;
	}
}

// 도/시 선택 옵션 초기화
function initializeProvinceSelect() {
	const provinceSelect = document.getElementById('province-select');
	
	// 도/시 옵션 추가
	Object.keys(provinceData).forEach(province => {
		provinceSelect.appendChild(new Option(province, province));
	});
	
	// 이벤트 리스너 등록
	provinceSelect.addEventListener('change', handleProvinceChange);
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', function () {
	initializeProvinceSelect();
	initializeOptionContent();
});

// 옵션 내용 초기화 및 이벤트 설정
function initializeOptionContent() {
	createOptionContent();
	setupOptionButtonEvents();
	setupCheckboxEvents();
}

// 옵션 버튼 이벤트 설정
function setupOptionButtonEvents() {
	const optionButton = document.querySelector('.store-map-option__button');
	const optionContent = document.querySelector('.store-map-option__content');

	optionButton.addEventListener('click', () => {
		optionContent.classList.toggle('active');
	});

	document.addEventListener('click', (event) => {
		if (!event.target.closest('.store-map-option')) {
			optionContent.classList.remove('active');
		}
	});
}

// 체크박스 이벤트 설정
function setupCheckboxEvents() {
	const checkboxes = document.querySelectorAll('.store-map-option__input');
	const optionButton = document.querySelector('.store-map-option__button');

	checkboxes.forEach(checkbox => {
		checkbox.addEventListener('change', () => {
			const selectedOptions = Array.from(checkboxes)
				.filter(cb => cb.checked)
				.map(cb => cb.nextElementSibling.textContent);

			optionButton.textContent = selectedOptions.length > 0 
				? selectedOptions.join(', ') 
				: '옵션 선택';
		});
	});
}

// 옵션 내용 생성 함수
function createOptionContent() {
	const optionList = document.querySelector('.store-map-option__list');

	// 매장 타입 섹션 생성
	const storeTypeSection = createOptionSection('storeType', optionData.storeType);
	optionList.appendChild(storeTypeSection);

	// 서비스 정보 섹션 생성
	const serviceInfoSection = createOptionSection('serviceInfo', optionData.serviceInfo);
	optionList.appendChild(serviceInfoSection);
}

// 옵션 섹션 생성 함수
function createOptionSection(sectionId, sectionData) {
	const section = document.createElement('div');
	section.className = `store-map-option__item ${sectionId}`;

	// 섹션 제목 생성
	const title = document.createElement('dt');
	title.className = 'store-map-option__name';
	title.textContent = sectionData.name;
	section.appendChild(title);

	// 옵션 항목들 생성
	sectionData.options.forEach(option => {
		const optionArea = document.createElement('dd');
		optionArea.className = 'store-map-option__area';

		const label = document.createElement('label');
		label.className = 'store-map-option__label';

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.className = 'store-map-option__input';
		input.name = sectionId;
		input.value = option.value;

		const text = document.createElement('span');
		text.className = 'store-map-option__text';
		text.textContent = option.text;

		label.appendChild(input);
		label.appendChild(text);
		optionArea.appendChild(label);
		section.appendChild(optionArea);
	});

	return section;
}

// 옵션 버튼 이벤트 처리
document.addEventListener('DOMContentLoaded', function () {
	// 옵션 내용 생성
	createOptionContent();

	const optionButton = document.querySelector('.store-map-option__button');
	const optionContent = document.querySelector('.store-map-option__content');

	// 옵션 버튼 클릭 이벤트
	optionButton.addEventListener('click', function () {
		optionContent.classList.toggle('active');
	});

	// 옵션 외부 클릭 시 닫기
	document.addEventListener('click', function (event) {
		if (!event.target.closest('.store-map-option')) {
			optionContent.classList.remove('active');
		}
	});

	// 체크박스 변경 이벤트
	const checkboxes = document.querySelectorAll('.store-map-option__input');
	checkboxes.forEach(checkbox => {
		checkbox.addEventListener('change', function () {
			const selectedOptions = Array.from(checkboxes)
				.filter(cb => cb.checked)
				.map(cb => cb.nextElementSibling.textContent);

			if (selectedOptions.length > 0) {
				optionButton.textContent = selectedOptions.join(', ');
			} else {
				optionButton.textContent = '옵션 선택';
			}
		});
	});
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
	// 카카오맵 API가 로드된 후 초기화 함수 실행
	if (typeof kakao !== 'undefined') {
		kakao.maps.load(function() {
			initializeMap();
			setupEventListeners();
		});
	} else {
		console.error('Kakao Maps API is not loaded');
	}
});

// 베스킨라빈스 매장 검색 함수
function searchBaskinRobbins() {
	// 기존 마커 제거
	removeAllMarkers();

	// 현재 지도의 영역 가져오기
	const bounds = map.getBounds();
	const swLatLng = bounds.getSouthWest(); // 남서쪽 좌표
	const neLatLng = bounds.getNorthEast(); // 북동쪽 좌표

	// 장소 검색 객체 생성
	const ps = new kakao.maps.services.Places();
	
	// 검색 옵션 설정
	const options = {
		keyword: '베스킨라빈스',
		location: map.getCenter(), // 현재 지도 중심 좌표
		radius: 5000, // 반경 5km
		bounds: bounds // 현재 지도 영역
	};

	// 장소 검색 실행
	ps.keywordSearch(options.keyword, (data, status) => {
		if (status === kakao.maps.services.Status.OK) {
			// 검색 결과 데이터 출력
			console.log('=== 베스킨라빈스 매장 검색 결과 ===');
			console.log('검색된 매장 수:', data.length);
			
			// 각 매장 정보 상세 출력
			data.forEach((place, index) => {
				console.log(`\n[매장 ${index + 1}]`);
				console.log('매장명:', place.place_name);
				console.log('주소:', place.address_name);
				console.log('도로명 주소:', place.road_address_name);
				console.log('전화번호:', place.phone);
				console.log('위도:', place.y);
				console.log('경도:', place.x);
				console.log('장소 ID:', place.id);
				console.log('카테고리:', place.category_name);
				console.log('거리:', place.distance);
				console.log('URL:', place.place_url);
			});

			// 현재 지도 영역 내의 장소만 필터링
			const filteredPlaces = data.filter(place => {
				const placeLatLng = new kakao.maps.LatLng(place.y, place.x);
				return bounds.contain(placeLatLng);
			});
			
			console.log('\n=== 필터링된 매장 정보 ===');
			console.log('현재 지도 영역 내 매장 수:', filteredPlaces.length);
			
			// 필터링된 장소만 표시
			displayPlaces(filteredPlaces);
		} else if (status === kakao.maps.services.Status.ZERO_RESULT) {
			console.log('검색 결과가 없습니다.');
		} else if (status === kakao.maps.services.Status.ERROR) {
			console.error('검색 중 오류가 발생했습니다.');
		}
	});
}

// 검색 결과 표시 함수
function displayPlaces(places) {
	const bounds = new kakao.maps.LatLngBounds();

	places.forEach(place => {
		// 마커 생성
		const marker = createMarker(
			new kakao.maps.LatLng(place.y, place.x),
			place.place_name
		);
		
		// 마커를 지도에 표시
		marker.setMap(map);
		
		// 마커를 배열에 저장
		markers.push(marker);

		// 커스텀 오버레이 생성
		const content = `
			<div class="customoverlay">
				<a href="${place.place_url}" target="_blank">
					<span class="title">${place.place_name}</span>
				</a>
			</div>
		`;

		const customOverlay = new kakao.maps.CustomOverlay({
			position: new kakao.maps.LatLng(place.y, place.x),
			content: content,
			yAnchor: 1
		});

		// 마커 클릭 이벤트
		kakao.maps.event.addListener(marker, 'click', function() {
			customOverlay.setMap(map);
		});

		// 마커 마우스아웃 이벤트
		kakao.maps.event.addListener(marker, 'mouseout', function() {
			customOverlay.setMap(null);
		});

		// 검색된 장소의 위치를 bounds에 추가
		bounds.extend(new kakao.maps.LatLng(place.y, place.x));
	});

	// 검색된 장소가 있는 경우에만 지도 범위 재설정
	if (places.length > 0) {
		map.setBounds(bounds);
	}
}

// 모든 마커 제거 함수
function removeAllMarkers() {
	markers.forEach(marker => marker.setMap(null));
	markers = [];
}

