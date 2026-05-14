Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("logo.png")
$bmp = New-Object System.Drawing.Bitmap($img)
$img.Dispose()
$bmp.MakeTransparent([System.Drawing.Color]::Black)
$bmp.Save("logo-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
