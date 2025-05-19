document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fileInput = document.getElementById('csvFile');
    const formData = new FormData();
    formData.append('csvFile', fileInput.files[0]);
  
    await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });
  
    // Now fetch and display songs
    fetchSongs();
  });
  
  async function fetchSongs() {
    const response = await fetch('http://localhost:3000/songs');
    const songs = await response.json();
  
    const output = document.getElementById('output');
    output.innerHTML = ''; // Clear previous
  
    songs.forEach(song => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${song.title}</strong> by ${song.artist} — <em>${song.album}</em>`;
      output.appendChild(div);
    });
  }
  
  // Fetch songs on page load
  fetchSongs();
  