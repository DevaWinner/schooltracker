from django.urls import path

from apps.users import views

app_name = 'users'

urlpatterns = [
    path('auth/register/', views.register_user, name='create-user'),
    path('auth/signin/', views.signin, name='sign-in'),
    path('auth/sigin_google/', views.google_login_view, name='google_sign_in'),
    path("user/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path('user/info/', views.UserInfoView.as_view(), name='user-info'),
    path('user/settings/', views.UserSettingsView.as_view(), name='user-settings'),
    path("user/profile/upload_document/", views.upload_view_documents, name="upload-document"),
]