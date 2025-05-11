window.onload = function () {
    kakao.maps.load(function () {
      map = new kakao.maps.Map(document.getElementById("map"), {
        center: new kakao.maps.LatLng(33.2539, 126.5596), // 서귀포시 초기 중심
        level: 9,
      });
      // loadData(); // 초기 로딩 (함수 정의 전이므로 주석 처리)
    });
  };

  document
    .getElementById("search-button")
    .addEventListener("click", searchPlaces);
  document
    .getElementById("search_keyword")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchPlaces();
    });


  function searchPlaces() {
    const keyword = document.getElementById("search_keyword").value;
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    showLoader();

    // 장소 검색 객체 생성
    const ps = new kakao.maps.services.Places();

    // 키워드로 장소 검색
    ps.keywordSearch(keyword, (data, status) => {
      hideLoader();

      if (status === kakao.maps.services.Status.OK) {
        // 검색 결과 처리
        displayPlaces(data);

        // 지도 범위 재설정
        if (data.length > 0) {
          const bounds = new kakao.maps.LatLngBounds();
          for (let i = 0; i < data.length; i++) {
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          map.setBounds(bounds);
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 중 오류가 발생했습니다.");
      }
    });
  }


  // 도/시와 구/군 데이터를 저장할 변수
const provinceData = {
    '서울': ['강남구', '강북구', '송파구', '서초구', '마포구', '용산구', '중구', '종로구'],
    '경기': ['수원시', '고양시', '성남시', '용인시', '안양시', '남양주시'],
    '부산': ['동래구', '서구', '부산진구', '해운대구', '수영구', '남구'],
    '인천': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구'],
    '대구': ['중구', '동구', '서구', '남구', '북구', '수성구'],
    '광주': ['동구', '서구', '남구', '북구', '광산구'],
    '대전': ['동구', '중구', '서구', '유성구', '대덕구'],
    '울산': ['중구', '남구', '동구', '북구', '울주군'],
    '세종': ['세종시'],
    '강원': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시'],
    '충북': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군'],
    '충남': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시'],
    '전북': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시'],
    '전남': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군'],
    '경북': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시'],
    '경남': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시'],
    '제주': ['제주시', '서귀포시']
};

// 도/시 선택 시 구/군을 동적으로 로드하는 함수
document.getElementById('province-select').addEventListener('change', function () {
    const province = this.value;
    const citySelect = document.getElementById('city-select');
    citySelect.innerHTML = '<option value="">구/군 선택</option>';  // 초기화
    
    if (province) {
        // 해당 도/시에 대한 구/군 정보를 가져옴
        const districts = provinceData[province];
        citySelect.disabled = false;  // 구/군 드롭다운 활성화
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            citySelect.appendChild(option);
        });
    } else {
        citySelect.disabled = true;  // 도/시가 선택되지 않았을 때 구/군 드롭다운 비활성화
    }
});

// 페이지가 로드되면 도/시 정보를 가져옴
window.addEventListener('DOMContentLoaded', function() {
    const provinceSelect = document.getElementById('province-select');
    
    // 도/시 리스트를 동적으로 추가
    for (const province in provinceData) {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    }
});