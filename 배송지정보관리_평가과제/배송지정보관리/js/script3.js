document.addEventListener('DOMContentLoaded', () => {
    let unetMembers = [];

    const draw = {
        // 호출 시점 tbody
        tbody : document.getElementById('membersTbody'),
        uid : 0, 
        // Grid Table
        grid (members) {
            if (members.length > 0) {
                const nodeSize = this.tbody.childNodes.length;
                members.forEach((member, index) => {
                    const trElem = document.createElement('tr');
                    trElem.innerHTML += `<td><button data-uid="${member.uid}" data-action="delete" class="btn-xs">삭제</button></td>`;
                    trElem.innerHTML += `<td>${member.shipaddr}</td>`;
                    trElem.innerHTML += `<td>${member.username}</td>`;
                    trElem.innerHTML += `<td>${member.uphonefirst + '-' +  member.uphonemid + '-' + member.uphonelast}</td>`;
                    trElem.innerHTML += `<td>${'(' + member.postcode + ') ' + member.road +  ' ' + member.detail}</td>`;
                    trElem.innerHTML += `<td>${member.defaultYn}</td>`;
                    trElem.innerHTML += `<td>${member.privacyYn}</td>`;
                    trElem.innerHTML += `<td><button data-uid="${member.uid}" data-action="modify" class="btn-xs">수정</button></td>`;
                    this.tbody.appendChild(trElem);
                });
            }
        },
        // 행 추가
        add (member) {
            if (unetMembers.length === 1) this.tbody.innerHTML = '';
            this.grid(member);
            this.uid++;
        },
        // 테이블 초기화
        init (members) {
            this.tbody.innerHTML = '';
            if (unetMembers.length === 0) {
                const trElem = document.createElement('tr');
                trElem.innerHTML += '<td colspan="9">데이터가 존재하지 않습니다.</td>';
                this.tbody.appendChild(trElem);
            } else {
                this.uid = members[members.length - 1]['uid'] + 1;
                this.grid(members);
            }
        },
    };

    const addMember = (members) => {
        const shipaddr = document.getElementById("shipaddr").value; // 배송지명
        const username = document.getElementById("username").value; // 받으시는분
        const uphonefirst = document.getElementById("uphonefirst").value; // 번호1
        const uphonemid = document.getElementById("uphonemid").value; // 번호2
        const uphonelast = document.getElementById("uphonelast").value; // 번호3
        const postcode = document.getElementById("postcode").value; // 우편번호
        const road = document.getElementById("road").value; // 주소
        const detail = document.getElementById("detail").value; // 상세주소
        const defaultYn = document.getElementById("defaultYn").checked; // 기본 배송지
        const privacyYn = document.getElementById("privacyYn").checked; // 이용동의
        document.forms.form.reset(); // 제출 후 초기화

        const member = {};
        member.uid = draw.uid;
        member.shipaddr = shipaddr;
        member.username = username;
        member.uphonefirst = uphonefirst;
        member.uphonemid = uphonemid;
        member.uphonelast = uphonelast;
        member.postcode = postcode;
        member.road = road;
        member.detail = detail;
        member.defaultYn = defaultYn;
        member.privacyYn = privacyYn;

        unetMembers = [...unetMembers, member];
        localStorage.setItem('members', JSON.stringify(unetMembers));
        draw.add([member]);
    };
    const actionMembersTbody = (e) => {
        const target = e.target;
        const action = target.dataset.action;
        const selectUid = target.dataset.uid;
        if (!action) return;

        if (action === 'delete') { // 삭제
            let node = target;
            while (true) {
                node = node.parentNode;
                if (node.tagName === 'TR') {
                    node.remove();
                    break;
                }
            }
            // array 삭제 후 reload
            unetMembers = unetMembers.filter(member => member.uid !== parseInt(selectUid));
            localStorage.setItem('members', JSON.stringify(unetMembers));

        } else if (action === 'modify') {
            const selectMember = unetMembers.find(member => member.uid === parseInt(selectUid));
            document.getElementById('memberUid').value = selectMember.uid;
            document.getElementById('shipaddr').value = selectMember.shipaddr;
            document.getElementById('username').value = selectMember.username;
            document.getElementById('uphonefirst').value = selectMember.uphonefirst;
            document.getElementById('uphonemid').value = selectMember.uphonemid;
            document.getElementById('uphonelast').value = selectMember.uphonelast;
            document.getElementById('postcode').value = selectMember.postcode;
            document.getElementById('road').value = selectMember.road;
            document.getElementById('detail').value = selectMember.detail;
            document.getElementById('defaultYn').value = selectMember.defaultYn;
            document.getElementById('privacyYn').value = selectMember.privacyYn;
            if (memberUpdateBtn.classList.contains('hiddenBtn')) toggelBtn();
        }
    };
    const modifyCancle = () => {
        toggleBtn();
        document.forms.form.reset();
    };
    const modifyMemberInfo = () => {
        const uid = document.getElementById("memberUid").value;
        const shipaddr = document.getElementById("shipaddr").value; // 배송지명
        const username = document.getElementById("username").value; // 받으시는분
        const uphonefirst = document.getElementById("uphonefirst").value; // 번호1
        const uphonemid = document.getElementById("uphonemid").value; // 번호2
        const uphonelast = document.getElementById("uphonelast").value; // 번호3
        const postcode = document.getElementById("postcode").value; // 우편번호
        const road = document.getElementById("road").value; // 주소
        const detail = document.getElementById("detail").value; // 상세주소
        const defaultYn = document.getElementById("defaultYn").checked; // 기본 배송지
        const privacyYn = document.getElementById("privacyYn").checked; // 이용동의

        unetMembers = unetMembers.map(v => {
            if (v.uid === parseInt(uid)) {
                v.shipaddr = shipaddr;
                v.username = username;
                v.uphonefirst = uphonefirst;
                v.uphonemid = uphonemid;
                v.uphonelast = uphonelast;
                v.postcode = postcode;
                v.road = road;
                v.detail = detail;
                v.defaultYn = defaultYn;
                v.privacyYn = privacyYn;
            }
            return v;
        });
        localStorage.setItem('members', JSON.stringify(unetMembers));
        alert('수정이 완료되었습니다.');
        draw.init(unetMembers);
        modifyCancle();
    };
    const toggleBtn = () => {
        memberAddBtn.classList.toggle('hiddenBtn');
        memberUpdateBtn.classList.toggle('hiddenBtn');
        updateCancleBtn.classList.toggle('hiddenBtn');
    };
    const getFilterMember = (e) => {
        const filterStr = e.target.value
        const filterMembers = unetMembers.filter(member => JSON.stringify(member).indexOf(filterStr) > -1);
        draw.init(filterMembers);
    };
    const initMember = () => {
        if (!confirm("멤버를 모두 삭제하시겠습니까?")) return;
        localStorage.clear();
        location.reload();
    }
    // 이벤트
    document.getElementById('memberAddBtn').addEventListener('click', () => addMember(unetMembers));
    document.getElementById('initMemberBtn').addEventListener('click', initMember);
    document.getElementById("membersTbody").addEventListener('click', (e) => actionMembersTbody(e));
    document.getElementById('memberUpdateBtn').addEventListener('click', modifyMemberInfo);
    document.getElementById('updateCancleBtn').addEventListener('click', modifyCancle);
    document.getElementById('filterBox').addEventListener('keyup', (e) => getFilterMember(e));
    // 초기화 배열
    if (localStorage.length > 0) { // 배열로 만들어준 init() 함수에 넣기
        unetMembers = [...JSON.parse(localStorage.getItem('members'))];
        draw.init(unetMembers);
    } else { // 로컬스토리지에 데이터가 없다면 빈 배열 넣기
        draw.init([]);
    }
});

// 유효성 검사 시작 //
document.getElementById("shipaddr").addEventListener('blur', function(event) { // 배송지명
        
    const value = this.value,
        elParent = this.parentElement, 
        parentClassList = elParent.classList;
    const regExp_ship = /^.{1,20}$/g; // 1~20 글자수 제한
    const regExp = /[<>]/g; // "<", ">" 제외

    if(value) {
        if((!regExp_ship.test(value)) || regExp.test(value)) {
            parentClassList.add('error');
            parentClassList.remove('success');
        } else {
            parentClassList.add('success');
            parentClassList.remove('error');
        }
    } else {
        parentClassList.remove('success', 'error');
    }
});
document.getElementById("username").addEventListener('blur', function(event) { // 받으시는분
        
    const value = this.value,
        elParent = this.parentElement, 
        parentClassList = elParent.classList;
    const regExp_user = /^.{1,10}$/g; // 1~10 글자수 제한
    const regExp = /[<>]/g; // "<", ">" 제외

    if(value) {
        if((!regExp_user.test(value)) || regExp.test(value)) {
            parentClassList.add('error');
            parentClassList.remove('success');
        } else {
            parentClassList.add('success');
            parentClassList.remove('error');
        }
    } else {
        parentClassList.remove('success', 'error');
    }
});
// 휴대폰 번호 설정
const firstList = document.querySelector('#uphonefirst'); // 첫 번째 select
const uphone_mid = document.querySelector('#uphonemid'); // 두 번째 input box
const uphone_last = document.querySelector('#uphonelast'); // 세 번째 input box

firstList.addEventListener('change', (event) => {

    if (event.target.value != "") { // "없음" 제외한 다른 option 선택 시 활성화
        uphone_mid.disabled = false;
        uphone_last.disabled = false;
    } else { // "없음" 선택 시 비활성화
        uphone_mid.disabled = true;
        uphone_last.disabled = true;
    }
});
document.getElementById("detail").addEventListener('blur', function(event) { // 상세주소

    const value = this.value,
        elParent = this.parentElement, 
        parentClassList = elParent.classList;
    const regExp = /[<>]/g; // "<", ">" 제외

    if(value) {
        if(regExp.test(value)) {
            parentClassList.add('error');
            parentClassList.remove('success');
        } else {
            parentClassList.add('success');
            parentClassList.remove('error');
        }
    } else{
        parentClassList.remove('success', 'error');
    } 
});
// 등록 버튼
document.getElementById('form').addEventListener('submit', function(event) {

    event.preventDefault();
    const privacyYn = document.getElementById("privacyYn").checked;

    if (!shipaddr.value) {
        alert("배송지명을 입력해주세요!");
        shipaddr.focus();
    } else if (!username.value) {
        alert("받으시는 분을 입력해주세요!");
        username.focus();
    } else if ((!uphone_mid.value) || (!uphone_last.value)) {
        alert("전화번호를 입력해주세요!");
        if (!uphone_mid.value) {
            uphone_mid.focus();
        } else {
            uphone_last.focus();
        }
    } else if ((!postcode.value)) {
        alert("주소를 입력해주세요!");
        postcode.focus();
    } else if (!privacyYn) {
        alert("배송정보수집 이용 동의에 체크해주세요!");
        privacyYn.focus();
    }
    else { // 위에 조건이 다 만족하면
        // 데이터 추가
        alert("배송지 등록 완료!");
    }
});
