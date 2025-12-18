#!/usr/bin/env python3
"""
Simple Python Contact Form Server for Dhruv Patel Portfolio
Run with: python server.py
Then open: http://localhost:8000
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
from datetime import datetime

# ========== CONFIGURATION ==========
# Email settings (use your Gmail)
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USER = 'pateldhruv8404@gmail.com'  # Your Gmail
EMAIL_PASSWORD = 'chqm yfro jxnp wtid'   # Your app password
EMAIL_TO = 'pateldhruv2723@gmail.com'    # Where to send emails

# Server settings
PORT = 8000
ALLOWED_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000']

# ========== EMAIL FUNCTION ==========
def send_email_via_smtp(name, email, subject, message):
    """Send email using SMTP (more reliable than PHP mail())"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_TO
        msg['Subject'] = f'Portfolio Contact: {subject}'
        
        # Email body
        body = f"""
        New Contact Form Submission:
        
        Name: {name}
        Email: {email}
        Subject: {subject}
        
        Message:
        {message}
        
        ---
        Received: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        From: Dhruv Patel Portfolio
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Create SSL context
        context = ssl.create_default_context()
        
        # Connect to SMTP server and send
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls(context=context)
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        return True, "Email sent successfully!"
        
    except Exception as e:
        return False, f"Email error: {str(e)}"

# ========== HTTP HANDLER ==========
class ContactFormHandler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """Serve static files"""
        parsed_path = urlparse(self.path)
        
        # Default to index.html
        if parsed_path.path == '/' or parsed_path.path == '':
            filepath = 'index.html'
        else:
            filepath = parsed_path.path.lstrip('/')
        
        # Security: prevent directory traversal
        if '..' in filepath or filepath.startswith('/'):
            self.send_error(404, "File not found")
            return
        
        # Check if file exists
        if not os.path.exists(filepath):
            # Try in current directory
            if os.path.exists(os.path.basename(filepath)):
                filepath = os.path.basename(filepath)
            else:
                self.send_error(404, "File not found")
                return
        
        # Determine content type
        content_type = 'text/html'
        if filepath.endswith('.css'):
            content_type = 'text/css'
        elif filepath.endswith('.js'):
            content_type = 'application/javascript'
        elif filepath.endswith('.png'):
            content_type = 'image/png'
        elif filepath.endswith('.jpg') or filepath.endswith('.jpeg'):
            content_type = 'image/jpeg'
        elif filepath.endswith('.ico'):
            content_type = 'image/x-icon'
        elif filepath.endswith('.pdf'):
            content_type = 'application/pdf'
        
        try:
            with open(filepath, 'rb') as file:
                content = file.read()
            
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.send_cors_headers()
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            
        except Exception as e:
            self.send_error(500, f"Server error: {str(e)}")
    
    def do_POST(self):
        """Handle contact form submissions"""
        if self.path != '/api/contact':
            self.send_error(404, "Endpoint not found")
            return
        
        try:
            # Get content length
            content_length = int(self.headers.get('Content-Length', 0))
            
            # Read request body
            post_data = self.rfile.read(content_length)
            
            # Parse JSON
            data = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['name', 'email', 'subject', 'message']
            for field in required_fields:
                if field not in data or not data[field].strip():
                    self.send_json_response(400, {
                        'success': False,
                        'message': f'Missing required field: {field}'
                    })
                    return
            
            # Validate email
            email = data['email'].strip()
            if '@' not in email or '.' not in email:
                self.send_json_response(400, {
                    'success': False,
                    'message': 'Invalid email address'
                })
                return
            
            # Send email
            success, message = send_email_via_smtp(
                data['name'].strip(),
                email,
                data['subject'].strip(),
                data['message'].strip()
            )
            
            if success:
                self.send_json_response(200, {
                    'success': True,
                    'message': 'Your message has been sent successfully! I will get back to you soon.'
                })
            else:
                # Log error for debugging
                print(f"Email failed: {message}")
                self.send_json_response(500, {
                    'success': False,
                    'message': 'Failed to send email. Please contact me directly at pateldhruv2723@gmail.com'
                })
                
        except json.JSONDecodeError:
            self.send_json_response(400, {
                'success': False,
                'message': 'Invalid JSON data'
            })
        except Exception as e:
            print(f"Server error: {e}")
            self.send_json_response(500, {
                'success': False,
                'message': f'Server error: {str(e)}'
            })
    
    def send_json_response(self, code, data):
        """Send JSON response with CORS headers"""
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        
        response = json.dumps(data).encode('utf-8')
        self.wfile.write(response)
    
    def send_cors_headers(self):
        """Add CORS headers to response"""
        origin = self.headers.get('Origin')
        if origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
        else:
            self.send_header('Access-Control-Allow-Origin', '*')
        
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Credentials', 'true')
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {format % args}")

# ========== MAIN ==========
def main():
    """Start the server"""
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, ContactFormHandler)
    
    print(f"""
    ╔══════════════════════════════════════════╗
    ║   Dhruv Patel Portfolio Server           ║
    ║   Running on: http://localhost:{PORT}    ║
    ║   Press Ctrl+C to stop                  ║
    ╚══════════════════════════════════════════╝
    
    Features:
    • Serves HTML/CSS/JS files
    • Contact form with SMTP email
    • CORS enabled for local development
    • Logs all requests
    
    Note: Make sure your Gmail app password is correct!
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
    except Exception as e:
        print(f"\n\nServer error: {e}")

if __name__ == '__main__':
    main()