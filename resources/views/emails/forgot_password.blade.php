@extends('emails.layout')
@section('content')
<h1 class="email-title">Reset Password</h1>
<p class="email-content">Click the link below to reset your password:</p>
<a href="{{ $resetLink }}" class="email-button">Reset Password</a>

<p class="email-content" style="margin-top: 20px">If it does not work, open the following URL in your browser.</p>
<p class="email-content" style="word-break: break-all;">{{ $resetLink }}</p>
@endsection