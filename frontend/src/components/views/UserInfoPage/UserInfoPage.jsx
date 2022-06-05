import { faDollyFlatbed } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react"
import { authHeader } from "../../../_helpers";
import './UserInfoPage.css';

function UserInfoPage(props){
	const [UserInfo, setuserInfo] = useState({u_id: "", u_email: "", u_name: "",u_password: 
    "",change_password: "", u_school: "", u_subject: "", is_student: true});
    const [viewinput,setviewinput] =useState(false);
    const [Name, setName] = useState("")
    const [Email, setEmail] = useState("")
    const [School, setSchool] = useState("")
    const [Department, setDepartment] = useState("")
    

    
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
    const onSubmitHandler = (event) => {
        event.preventDefault();

        // 폼 유효성 검사
        if (checkInputs()){
            let body = {
                id: UserInfo.u_id,
                pw: UserInfo.u_password,
                is_student: UserInfo.is_student,
                name: Name,
                email: Email,
                school: School,
                department: Department
            }
    
            EditUserRequest(body)
            .then( ()=> {
                alert('변경되었습니다.')
            })
        }else {
            alert('변경 권한이 없습니다')
        }
    }

    const checkInputs = ()=>{
        
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


    const user_pass = '1234'

    useEffect(() => {
        // 폴더 정보 요청
        setuserInfo({
            u_id: 'sjw0592',
            u_email: "sjw0592@khu.ac.kr",
            u_name: "손지원",
            u_password: "1234",
            u_school: "경희대학교",
            u_subject: "컴퓨터공학과",
            change_password: "",
        })

         // UserRequest().then((data) =>
        //     setuserInfo({
        //     u_id: data.id,
        //     u_name: data.name,
        //     u_email: data.e-mail,
        //     u_password: data.password, 
        //     is_student: data.is_student    
        //     })
        // );
    }, []);

    function onChangetext (e){
        setuserInfo.u_password(e.target.value);
    }

    const UserRequest = () => {
        const url = "api/member-detail/";
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

    const EditUserRequest = (body) => {
        const url = "api/member-detail/";
        const requestOptions = {
            method: "PUT",
            headers: {

            },
            body: JSON.stringify(body)
        };

        return (fetch(url, requestOptions)
                .then(handleResponse)
        )
    }

    const deleteUser = () => {
        if (user_pass === UserInfo.u_password) {
            deleteRequest()
            .then(
                ()=>{
                    alert('회원탈퇴 되었습니다.');
                    props.history.push('/login');
                }
            )
        } else {
            alert('삭제 권한이 없습니다.')
        }
    }

    const deleteRequest = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            }
        };

        const url = '/api/member-detail/'

        return (
            fetch(url, requestOptions)
            .then(handleResponse)
        )
    }

    const handleResponse = (response) => {
        if (!response.status === 200 && !response.status === 204) {
        if (
            response.status === 400 ||
            response.status === 401 ||
            response.status === 404
        ) {
            window.location.reload(true);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
        }
        return response;
    };


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
                    <p className="UItemTitle">이메일</p>
                    { !viewinput && <p>{UserInfo.u_email}</p> }
                    { viewinput && <input type="text" value={Email} onChange={onEmailHandler}/>}
                </div>
                <div className="UItem">
                    <p className="UItemTitle">이름</p>
                    { !viewinput && <p>{UserInfo.u_name}</p> }
                    { viewinput && <input type="text" value={Name} onChange={onNameHandler}/>}
                </div> 
                <div className="UItem">
                    <p className="UItemTitle">학교</p>
                    { !viewinput && <p>{UserInfo.u_school}</p> }
                    { viewinput && <input type="text" value={School} onChange={onSchoolHandler}/>}
                </div>
                <div className="UItem">
                    <p className="UItemTitle">학과</p>
                    { !viewinput && <p>{UserInfo.u_subject}</p> }
                    { viewinput && <input type="text" value={Department} onChange={onDepartmentHandler}/>}
                </div>
                <div className="UItem">
                    <button onClick={() => {setviewinput(true);}}>변경</button>
                    <button type="submit">확인</button>
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


            