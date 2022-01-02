
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
                            //verifyla degis
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

    $('#adminVerifyButton').click(function () {
        let code = $('#verifyCode').val()
        $.ajax({
            url: '/staff/admin/verify',
            method: 'POST',
            data: { code },
            success: (result) => {
                if (result.success) {
                    console.log(result)
                    window.location.href = '/staff/admin/home'
                } else {
                    Swal.fire('Kod Hatalı.!')
                }
            }
        })
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

    $('.deleteuserbutton').click(function () {

        $.ajax({
            url: '/staff/admin/deleteuser',
            method: 'POST',
            data: { id: this.id },
            success: (result) => {
                if (result.success) {
                    $(this).parents('.tr').remove();
                    Swal.fire('Üye Silindi.')
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })
    })

    $('.wasCommitButton').click(function () {

        $.ajax({
            url: '/staff/admin/getOneCommit',
            method: 'POST',
            data: { id: this.id },
            success: (result) => {
                if (result.success) {
                    Swal.fire(String(result.commit))
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })

    })


    $('.sendfbcmButton').click(function () {
        let title = $('#messagetitle').val()
        let body = $('#messagebody').val()
        $.ajax({
            url: '/staff/admin/sendfbcm',
            method: 'POST',
            data: { title, body },
            success: (result) => {
                if (result.success) {
                    Swal.fire('Mesaj Yollandı')
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })

    })

    $('.deletefalbutton').click(function () {

        $.ajax({
            url: '/staff/admin/deletefal',
            method: 'POST',
            data: { id: this.id },
            success: (result) => {
                if (result.success) {
                    $(this).parents('.tr').remove();
                    Swal.fire('Fal Silindi.')
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })

    })

    $('.banuserbutton').click(function () {

        $.ajax({
            url: '/staff/admin/dobanuser',
            method: 'POST',
            data: { id: this.id },
            success: (result) => {
                if (result.success) {
                    $(this).parents('.tr').remove();
                    Swal.fire('Üye Banlandı.')
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })

    })
    $('.unbanuserbutton').click(function () {

        $.ajax({
            url: '/staff/admin/dounbanuser',
            method: 'POST',
            data: { id: this.id },
            success: (result) => {
                if (result.success) {
                    $(this).parents('.tr').remove();
                    Swal.fire('Üye Banı Kaldırıldı.!')
                } else {
                    Swal.fire('Hata.!')
                }
            }
        })

    })




})
