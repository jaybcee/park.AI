$(document).ready(function(){
   

    $('#spotsMenu').hide()
    $('#spots').on('click', () => {
        $('#spotsMenu').slideToggle(500);
        $('#payMenu').hide();
    });

    //NEW JQ STRT
    $('#payMenu').hide();
    $('#pay').on('click', () => {
        $('#payMenu').slideToggle(500);
        $('html, body').animate({
            scrollTop: $("#payMenu").offset().top
        }, 1000);
        $('#spotsMenu').hide();
    
    });

    $(function () {
        var lastScrollTop = 0;
        var $navbar = $('.navbar');
        var navbarHeight = $navbar.outerHeight();
        var movement = 0;
        var lastDirection = 0;
      
        $(window).scroll(function(event){
          var st = $(this).scrollTop();
          movement += st - lastScrollTop;
      
          if (st > lastScrollTop) { 
            if (lastDirection != 1) {
              movement = 0;
            }
            var margin = Math.abs(movement);
            if (margin > navbarHeight) {
              margin = navbarHeight;
            }
            margin = -margin;
            $navbar.css('margin-top', margin+"px")
      
            lastDirection = 1;
          } else { // scroll up
            if (lastDirection != -1) {
              movement = 0;
            }
            var margin = Math.abs(movement);
            if (margin > navbarHeight) {
              margin = navbarHeight;
            }
            margin = margin-navbarHeight;
            $navbar.css('margin-top', margin+"px")
      
            lastDirection = -1;
          }
      
          lastScrollTop = st;
          // console.log(margin);
        });
      });



    
//NEW JQ ENDT

    $("#spots").mouseover(function() {

         $("#spots span").css('opacity','1'); 
        });

        $("#spots").mouseout(function() {
            $("#spots span").css('opacity','0'); 
           });

        $("#pay").mouseover(function() {
            $("#pay span").css('opacity','1'); 
           });
           $("#pay").mouseout(function() {
            $("#pay span").css('opacity','0'); 
           });


    $('#time').on('input', function() {
        var x = $('#time').val();

        go(x);
    });
    $('#time').change(() => {
        var x = $('#time').val();

        go(x);
    
      });

      function go(y){
          
        var cost
        if (y<=6) {
            cost = y*5
        }
        else if (y>6) {
            cost = 32
        }

        $("#replaceMe").text('Prix final: ' + cost +'$');
        $( "#replaceMe" ).css( "display", "block" )

      }

      $("#alerted").hide();

      $('#myForm').submit(function(e){
        
        e.preventDefault();
        $.ajax({
            url:'https://hackatown2019.herokuapp.com/user',
            type:'post',
            data:$('#myForm').serialize(),
            complete:function(res,data){
                $("#alerted").show();
                console.log(res);
                console.log((data))
            }
        });
    });

    setTimeout(() => {
        visionBig();
    }, 100);

    setTimeout(() => {
    $("#gifer").show();  
                }, 1000);

    function visionBig(){
        
        vision(0, 3);
        vision(5000, 6);
        $("#gifer").show();
        vision(15000, 2);
        $("#gifer").show();
        vision(25000, 9);
        $("#gifer").show();
        vision(35000, 7);
        $("#gifer").show();
        vision(45000, 1);
        $("#gifer").show();
        vision(55000, 8);
        $("#gifer").show();
        vision(65000, 5);
        $("#gifer").show();
        vision(75000, 4);
        $("#gifer").show();
        setTimeout(() => {
            visionBig()
        }, 85000);
        $("#gifer").show();
    }

    function vision(time, index){
        setTimeout(() => { 
        $.ajax({
            url:'https://hackatown2019.herokuapp.com/test',
            contentType: 'application/json',
            data: JSON.stringify({
                "index": index
            }),
            type:'post',
            processData: false,
            success:function(){
                //whatever you wanna do after the form is successfully submitted
            }
        });

        $.ajax({
            type: "GET",
            url: "https://hackatown2019.herokuapp.com/num", //https://hackatown2019.herokuapp.com/num
            cache: false,
            success: function(data){
               console.log(data)
                $("#risotto").html("Il y a présentement " + data.number + "/25 véhicules stationnés.    " + "<i id='gifer' class='fas fa-spinner fa-spin'></i>")
                $("#gifer").hide();
                setTimeout(() => {
                    $("#gifer").show();  
                }, 8000);
            }
          });

    }, time);
    }
});
    
    
