function myToggle() {
    var contentContainer = document.getElementById("contentContainer");
    contentContainer.classList.toggle("noDisplay");
    var logIn = document.getElementById("enterContainer");
    logIn.classList.toggle("noDisplay");
}

var stompClient=null



function sendMessage(){


    let jsonOb={
        name:localStorage.getItem("name"),
        content:$("#message").val()
    }

    stompClient.send("/app/message",{},JSON.stringify(jsonOb));

    $('#message').val('');

}



function connect()
{

    let socket=new SockJS("/server1")

    stompClient=Stomp.over(socket)

    stompClient.connect({},function(frame){

        console.log("Connected : "+frame)

   myToggle();


        //subscribe
        stompClient.subscribe("/topic/text",function(response){

            showMessage(JSON.parse(response.body))

        })



    })

}


function showMessage(message)
{
    console.log("working");
    $("#tableContent").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`)


}





$(document).ready((e)=>{


    $("#enter").click(()=>{


        let name=$("#name").val()
        localStorage.setItem("name",name)
        connect();


    })

    $("#send").click(()=>{
        sendMessage()
    })

    $("#logout").click(()=>{

        localStorage.removeItem("name")
        if(stompClient!==null)
        {
            stompClient.disconnect()

            myToggle();
            console.log(stompClient)
        }

    })

})