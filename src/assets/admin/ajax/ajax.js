
$(document).ready(() => {
    //login page
    $('#loginButton').click(() => {
        let username = $('#exampleInputEmail').val()
        let password = $('#exampleInputPassword').val()
        if (username.length != 0 && password.length != 0) {
            $.ajax({
                url: '/staff/admin',
                method: 'POST',
                data: {
                    username, password
                },
                success: (result) => {
                    if (result.success == 'error') {
                        Swal.fire('Hata Oluştu')
                    } else {
                        result.success ?
                            window.location.href = '/staff/admin/home'
                            :
                            Swal.fire('Bilgiler eksik veye yanlış.')
                    }
                }
            })
        } else {
            Swal.fire('Salak mısın ?')
        }
    })

    //commit coffee
    $('.commitButton').click(function () {
        let yorum = $('#yorum').val()
        $.ajax({
            url: '/staff/admin/addcommit?falid=' + this.id,
            method: 'POST',
            data: { commit: yorum },
            success: (result) => {
                if (result.success) {
                    Swal.fire('Yorum yapıldı')
                    window.location.href = '/staff/admin/commitfal'
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })
    })

    // send noti

    $('#sendNotiButton').click(function () {
        let notiText = $('#notificationText').val()
        let notiType = $('#notificationType').val()
        $.ajax({
            url: '/staff/admin/sendNotification',
            method: 'POST',
            data: { notificationText: notiText, notificationType: notiType },
            success: (result) => {
                if (result.success) {
                    $('#closeModal').trigger('click')
                    Swal.fire('Bildirim yollandı.')
                } else {
                    $('#closeModal').trigger('click')
                    Swal.fire('Hata.!')
                }
            }
        })
    })

    $('.deletenotibutton').click(function () {

        $.ajax({
            url: '/staff/admin/deleteNotification',
            method: 'POST',
            data: { id: this.id },
            success: (result) => {
                if (result.success) {
                    $(this).parents('.tr').remove();
                    Swal.fire('Bildirim silindi.')
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })
    })


})
