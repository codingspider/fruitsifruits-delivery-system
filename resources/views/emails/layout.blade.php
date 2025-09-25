<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Nunito', 'Helvetica Neue', Arial, sans-serif;
        }
        
        body {
            background-color: #f7f9fc;
            color: #4a5568;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .email-header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            padding: 30px 20px;
            text-align: center;
        }
        
        .email-logo {
            font-size: 28px;
            font-weight: 700;
            color: white;
            text-decoration: none;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .email-title {
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .email-content {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4a5568;
        }
        
        .email-button {
            display: block;
            width: 200px;
            margin: 0 auto;
            padding: 14px 20px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white !important;
            text-align: center;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(37, 117, 252, 0.3);
        }
        
        .email-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(37, 117, 252, 0.4);
        }
        
        .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 40px 0;
        }
        
        .feature-item {
            width: 33.33%;
            padding: 15px;
            text-align: center;
        }
        
        .feature-icon {
            font-size: 32px;
            color: #4299e1;
            margin-bottom: 15px;
        }
        
        .feature-title {
            font-weight: 700;
            margin-bottom: 8px;
            font-size: 16px;
            color: #2d3748;
        }
        
        .feature-text {
            font-size: 14px;
            color: #718096;
        }
        
        .email-footer {
            background-color: #edf2f7;
            padding: 25px 20px;
            text-align: center;
            font-size: 14px;
            color: #718096;
        }
        
        .social-links {
            margin-bottom: 20px;
        }
        
        .social-link {
            display: inline-block;
            width: 36px;
            height: 36px;
            line-height: 36px;
            border-radius: 50%;
            background-color: #cbd5e0;
            color: #4a5568;
            margin: 0 5px;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background-color: #4299e1;
            color: white;
            transform: translateY(-3px);
        }
        
        .footer-links {
            margin-top: 15px;
        }
        
        .footer-link {
            color: #4299e1;
            text-decoration: none;
            margin: 0 10px;
        }
        
        .footer-link:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            .feature-item {
                width: 100%;
                max-width: 300px;
                margin: 0 auto 20px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <a href="#" class="email-logo">{{ env('APP_NAME') }}</a>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            @yield('content')
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <p>&copy; {{ date('Y') }} {{ env('APP_NAME') }}. All rights reserved.</p>
            
            <div class="footer-links">
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Contact Us</a>
            </div>
        </div>
    </div>
</body>
</html>