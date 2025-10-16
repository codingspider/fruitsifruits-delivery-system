<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" id="app-favicon" href="/default-favicon.png">
    <title>{{ env('APP_NAME') }}</title>
    @viteReactRefresh
    @vite('resources/js/src/App.jsx')
    @PwaHead
</head>
<body>
    <div id="app"></div>
    @RegisterServiceWorkerScript
</body>
</html>
