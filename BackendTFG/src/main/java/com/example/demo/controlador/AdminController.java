package com.example.demo.controlador;

import com.example.demo.dto.AdminMarcaRequest;
import com.example.demo.dto.AdminPerfumeRequest;
import com.example.demo.model.Categoria;
import com.example.demo.model.Marca;
import com.example.demo.model.Perfume;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.MarcaRepository;
import com.example.demo.repository.PerfumeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping({"/api/admin", "/admin"})
public class AdminController {

    private final PerfumeRepository perfumeRepository;
    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;

    public AdminController(PerfumeRepository perfumeRepository,
                           MarcaRepository marcaRepository,
                           CategoriaRepository categoriaRepository) {
        this.perfumeRepository = perfumeRepository;
        this.marcaRepository = marcaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @PostMapping
    public ResponseEntity<String> adminPing() {
        return ResponseEntity.ok("Admin endpoint disponible");
    }

    @GetMapping("/perfumes")
    public ResponseEntity<List<Perfume>> getAllPerfumes() {
        List<Perfume> perfumes = perfumeRepository.findAll();
        if (perfumes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(perfumes);
    }

    @PostMapping("/perfumes")
    public ResponseEntity<Perfume> createPerfume(@RequestBody AdminPerfumeRequest request) {
        Marca marca = marcaRepository.findById(request.getIdMarca())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Marca no encontrada"));
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría no encontrada"));

        Perfume perfume = new Perfume();
        perfume.setNombre(request.getNombre());
        perfume.setDescripcion(request.getDescripcion());
        perfume.setPrecio(request.getPrecio());
        perfume.setImagenUrl(request.getImagenUrl());
        perfume.setStock(request.getStock());
        perfume.setEnOferta(request.getEnOferta());
        perfume.setIdGenero(request.getIdGenero());
        perfume.setCategoriaEntity(categoria);
        perfume.setMarca(marca);

        Perfume saved = perfumeRepository.save(perfume);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/perfumes/{id}")
    public ResponseEntity<Perfume> updatePerfume(@PathVariable Long id,
                                                 @RequestBody AdminPerfumeRequest request) {
        Perfume perfume = perfumeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfume no encontrado"));

        Marca marca = marcaRepository.findById(request.getIdMarca())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Marca no encontrada"));
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría no encontrada"));

        perfume.setNombre(request.getNombre());
        perfume.setDescripcion(request.getDescripcion());
        perfume.setPrecio(request.getPrecio());
        perfume.setImagenUrl(request.getImagenUrl());
        perfume.setStock(request.getStock());
        perfume.setEnOferta(request.getEnOferta());
        perfume.setIdGenero(request.getIdGenero());
        perfume.setCategoriaEntity(categoria);
        perfume.setMarca(marca);

        return ResponseEntity.ok(perfumeRepository.save(perfume));
    }

    @DeleteMapping("/perfumes/{id}")
    public ResponseEntity<Void> deletePerfume(@PathVariable Long id) {
        if (!perfumeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        perfumeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/marcas")
    public ResponseEntity<List<Marca>> getAllMarcas() {
        List<Marca> marcas = marcaRepository.findAll();
        if (marcas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(marcas);
    }

    @PostMapping("/marcas")
    public ResponseEntity<Marca> createMarca(@RequestBody AdminMarcaRequest request) {
        Marca marca = new Marca();
        marca.setNombre(request.getNombre());
        marca.setPaisOrigen(request.getPaisOrigen());
        marca.setDescripcion(request.getDescripcion());
        marca.setActivo(request.getActivo() == null ? 1 : request.getActivo());
        marca.setLogoUrl(request.getLogoUrl());

        Marca saved = marcaRepository.save(marca);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
