import { faDollyFlatbed } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react"
import { authHeader } from "../../_helpers";
import './UserInfoPage.css';

function UserInfoPage(props){
	const [UserInfo, setUserInfo] = useState({});
    const [viewinput,setviewinput] =useState(false);
    const [Name, setName] = useState("")
    const [Email, setEmail] = useState("")
    const [School, setSchool] = useState("")
    const [Department, setDepartment] = useState("")
    const baseurl = 'http://3.231.84.43:8000';
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user){
            // 유저 정보 요청
            setUser();
        } else {
            return;
        }
    }, []);

    useEffect(() => {
        UserRequest()
            .then(
                data => {
                    setUserInfo(data)
                },
                error => alert('유저 정보를 불러올 수 없습니다.')
            );

    },[UserInfo])


    // 
    const setUser = () =>{
        UserRequest()
            .then(
                data => {
                    console.log(data);
                    setUserInfo(data)
                    setName(data.name);
                    setEmail(data.email);
                    setSchool(data.school);
                    setDepartment(data.department);
                },
                error => alert('유저 정보를 불러올 수 없습니다.')
            );
    }

    /**
     * 요청
     */
    // 회원정보 요청
    const UserRequest = () => {
        const url = baseurl + "/api/member-detail/";
        const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader().Authorization,
            },
        };

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    };
    // 회원정보 수정 요청
    const EditUserRequest = (body) => {
        const url = baseurl + "/api/member-detail/";
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader().Authorization,
                },
            body: JSON.stringify(body)
        };

        return (fetch(url, requestOptions)
            .then(handleResponse)
        )
    };
    // 회원탈퇴 요청
    const deleteRequest = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        const url = baseurl + '/api/member-detail/';

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }
    const handleResponse = (response) => {
        return response.text().then(json => {
            const data = json && JSON.parse(json);
            if (response.status !== 200) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            
            return data;
        });
    };


    /**
     * 버튼 동작
     */
    // 회원탈퇴
    const deleteUser = () => {
        deleteRequest()
        .then(
            ()=>{
                alert('회원탈퇴 되었습니다.');
                props.history.push('/login');
            },
            ()=>alert('회원탈퇴에 실패했습니다.')
        )
    }
    // 회원정보 변경
    const onSubmitHandler = (event) => {
        event.preventDefault();

        // 폼 유효성 검사
        if (checkInputs()){
            const body = {
                id: UserInfo.id,
                is_student: UserInfo.is_student,
                name: Name,
                email: Email,
                school: School,
                department: Department
            }
            console.log(body)
    
            EditUserRequest(body)
            .then(
                data => {
                    setUser();
                    setviewinput(false);
                    alert('변경되었습니다.');
                },
                error => {
                    alert('변경 권한이 없습니다.')
                }
            )
        }
    }


    // input 값 받아서 저장
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onSchoolHandler = (event) => {
        setSchool(event.currentTarget.value)
    }
    const onDepartmentHandler = (event) => {
        setDepartment(event.currentTarget.value)
    }
    // 회원정보 수정 폼 검사
    const checkInputs = ()=>{
        const isEmail = (email) => {
            return /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/.test(email);
        }
        const isSchool = (school) => {
            return school.slice(school.length-3,school.length) === "대학교";
        }
        const isDepartment = (department) => {
            return (department.slice(department.length-2,department.length) === "학과") || 
            (department.slice(department.length-2,department.length) === "학부");
        }

        if(!isEmail(Email)) {
            alert('유효하지않은 형식의 이메일입니다.')
            return false;
        }
        else if(!isSchool(School)) {
            alert('정확한 학교 이름을 입력해주세요.')
            return false;
        }
        else if(!isDepartment(Department)) {
            alert('정확한 학과 이름을 입력해주세요.')
            return false;
        }
        else {
            return true;
        }     
    }

    return(
        <div className="UserInfoPage">
            <div className="UContainer" onSubmit={onSubmitHandler}>
                <div className="UCategory">
                    <div className="CategoryName">계정 설정</div>
                </div>
                <div className="UItem">
                    <p className="UItemTitle">아이디</p>
                    <p>{UserInfo.id}</p>
                </div>
                <div className="UItem">
                    <p className="UItemTitle">권한</p>
                    { UserInfo.is_student===true
                    ? <p>수강자</p> 
                    : <p>강의자</p>}
                </div> 
                <div className="UItem">
                    <p className="UItemTitle">이름</p>
                    { !viewinput && <p>{UserInfo.name}</p> }
                    { viewinput && <input type="text" value={Name} onChange={onNameHandler}/>}
                </div> 
                <div className="UItem">
                    <p className="UItemTitle">이메일</p>
                    { !viewinput && <p>{UserInfo.email}</p> }
                    { viewinput && <input type="text" value={Email} onChange={onEmailHandler}/>}
                </div>
                <div className="UItem">
                    <p className="UItemTitle">학교</p>
                    { !viewinput && <p>{UserInfo.school}</p> }
                    { viewinput && <input type="text" value={School} onChange={onSchoolHandler} placeholder='예) ㅇㅇ대학교'/>}
                </div>
                <div className="UItem">
                    <p className="UItemTitle">학과</p>
                    { !viewinput && <p>{UserInfo.department}</p> }
                    { viewinput && <input type="text" value={Department} onChange={onDepartmentHandler} placeholder='예) ㅇㅇ학과 또는 ㅇㅇ학부'/>}
                </div>
                <div className="UItem">
                    {
                        viewinput === false
                        ? (<button onClick={() => {setviewinput(true);}}>변경</button>)
                        : (
                        <>
                            <button type="submit" onClick={onSubmitHandler}>확인</button>
                            <button type="submit" onClick={() => {setviewinput(false);}}>취소</button>
                        </>)
                    }
                </div>
                <div className="UItem">
                    <button className="UButton" onClick={deleteUser}>회원탈퇴</button>
                </div>
            </div>
        </div>
    );
}
export {UserInfoPage}

/*
<div className="UItem">
                    <p className="UItemTitle">비밀번호 변경</p>
                    <input onChange={onChangetext}/>
                </div>*/


            